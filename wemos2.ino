/*Pour la connexion WiFi */
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
/*Pour la connexion de la carte SD */
#include <SD.h>
#include <SPI.h>
/*Pour manipuler la mémoire flash*/
#include <FS.h>
#include <LittleFS.h>
/*Pour la connexion et la communication avec firebase*/
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
/*Pour obtenir l'heure en ligne */
#include <NTPClient.h>
#include <WiFiUdp.h>
/*Pour utiliser certaines fonctions */
#include <algorithm>
#include <ctime>

/*Pour l'écran LCD*/
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

#if defined(ARDUINO) && ARDUINO >= 100
#define printByte(args) write(args);
#else
#define printByte(args) print(args, BYTE);
#endif

/*Les fichiers inclus
*credential.h qui contient les informations sensibles de connexion
*ArduinoJson.h pour la sérialisation et la désérialisation des données en Json
*/
#include "credential.h"
#include "ArduinoJson.h"

const char *ssid = SSID;
const char *password = PASS;
File root;
File imageFile;
File textFile;
bool isSDFunctionning = true;

//Pour la sérialisation
DynamicJsonDocument jsonMessage(1024);
String imagesFolder = "/espImages";

WiFiServer server(PORT);
String command;

// Initialisation firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig configF;
String destination;
unsigned long dataMillis = 0;
int count = 0;
FirebaseJson content;
FirebaseJsonData configJsonData;


bool taskCompleted = false;

//Serveur NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "europe.pool.ntp.org", 3600, 60000);
String timestampToDateString(unsigned long timestamp);
String date;
unsigned long heureDébut;
unsigned long heureFin;
/* 
*
*Protoypes de fonctions*/
//callback de la fonction d'upload sur firebase
void fcsUploadCallback(FCS_UploadStatusInfo info);
//Fonctions de manipulation des fichiers de la mémoire Flash
void deleteFile(const char *path);
void renameFile(const char *path1, const char *path2);
void appendFile(const char *path, const char *message);
void writeFile(const char *path, const char *message);
void readFile(const char *path);
void listDir(const char *dirname, uint8_t levels);
/* Fin prototypes*/

//Initialisation écran
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.home();
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print("+");
  }
  lcd.print("----CONNECTED----");
  Serial.println("");
  Serial.print("Connecté à ");
  Serial.println(ssid);
  Serial.print("Adresse IP: ");
  Serial.println(WiFi.localIP());
  //Activation du timeClient
  timeClient.begin();

  /*
  lcd.clear();
  lcd.setCursor(0, 1);
  Serial.println(date); */

  //Initialisation de la carte SD
  if (!SD.begin(4)) {
    Serial.println("Échec de l'initialisation de la carte SD");
    isSDFunctionning = false;
  } else {
    Serial.println("SD card initialisation done");
  }
  if (!LittleFS.begin()) {
    Serial.println("An Error has occurred while mounting LittleFS");
    return;
  }
  Serial.println("Flash initialisation done");
  if (isSDFunctionning) {
    if (!SD.exists(imagesFolder)) {
      if (!SD.mkdir(imagesFolder)) {
        Serial.println("Erreur création de dossier");
        return;
      }
      Serial.println("Dossier créé avec succès");
    }
  }

  root = SD.open("/");
  server.begin();
  // Firebase Initialisation
  configF.api_key = FIREBASE_API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  configF.token_status_callback = tokenStatusCallback;
  Firebase.begin(&configF, &auth);
  Firebase.reconnectWiFi(true);
  configF.fcs.upload_buffer_size = 1024;
  configF.fcs.download_buffer_size = 2048;
}

void loop() {
  /*if(!timeClient.update()){
    Serial.println("Échec de mise à jour du client NTP");
  }*/
  timeClient.update();
  unsigned long seconds = timeClient.getEpochTime();
  date = timestampToDateString(seconds);
  /* Serial.println(timeClient.getFormattedTime());
  Serial.println(seconds);
  Serial.println(date); */
  WiFiClient client = server.available();
  File configFile = LittleFS.open("config.txt", "w");
  string configStr;
  if (!configFile) {
    Serial.println("erreur de création du ficher de configuration");
    return;
  }
  String configSource = "/configs/" + String(USER_UID) + "/config.txt";
  String configLocalPath = imagesFolder + "/config.txt";
  /* Serial.println(configSource);
  Serial.println(configLocalPath); */
  if (!Firebase.Storage.download(&fbdo,
                                 STORAGE_BUCKET_ID /* Firebase Storage bucket id */,
                                 "/configs/" + String(USER_UID) + "/config.txt" /* path of remote file stored in the bucket */,
                                 imagesFolder + "/config.txt" /* path to local file */,
                                 mem_storage_type_flash /* memory storage type, mem_storage_type_flash and mem_storage_type_sd */,
                                 fcsDownloadCallback /* callback function */)) {
    Serial.println(fbdo.errorReason());
  }
  while (configFile.available()) {
    configStr += char(file.read());
  }
  configFile.close();
  content.setJsonData(configStr);
  json.get(configJsonData,"heureDebut");
  if(configJsonData.succes){
    heureDebut=configJsonData.to<unsigned long>();
  }
  json.get(configJsonData,"heureFin");
  if(configJsonData.succes){
    heureFin=configJsonData.to<unsigned long>();
  }

  if (Serial.available() > 0) {
    command = Serial.readStringUntil('\n');
    if (command == "list;") {
      printDirectory(root, 0);
    }
    if (command == "ls;") {
      listDir("/", 1);
    }
    if (command == "showImages;") {
      int fileCount = 0;
      File images = SD.open(imagesFolder);
      listFilesInDir(images, nullptr, fileCount);
      String *fileList = new String[fileCount];
      fileCount = 0;
      images.rewindDirectory();
      listFilesInDir(root, fileList, fileCount);
      for (int i = 0; i < fileCount; i++) {
        Serial.println(fileList[i]);
      }
      delete[] fileList;
    }
  }
  //On reteste la carte
  if (!SD.begin(4)) {
    // Serial.println("Échec de l'initialisation de la carte SD");
    isSDFunctionning = false;
  }
  if (client) {
    Serial.println("Nouveau client connecté");
    while (client.connected()) {
      if (client.available()) {

        String incommingMessage = client.readStringUntil('\n');
        Serial.print(incommingMessage);
        fbdo.setBSSLBufferSize(4096, 1024);
        fbdo.setResponseSize(2048);
        DeserializationError err = deserializeJson(jsonMessage, incommingMessage);
        if (err) {
          Serial.println("ERROR: ");
          Serial.println(err.c_str());
          return;
        }
        String action = jsonMessage["action"];
        String position = jsonMessage["position"];
        String ipAdress = jsonMessage["ip"];
        if (action == "imageEsp") {
          /*Traitement de la reception de l'image*/
          size_t imageSize = jsonMessage["size"];
          int i = 0;
          // imageFile = SD.open(imagesFolder + "/" + filename, FILE_WRITE);
          Serial.println("date");
          String image = imagesFolder + "/" + date + ".jpeg";
          Serial.println(image);
          if (isSDFunctionning) {
            imageFile = SD.open(image, FILE_WRITE);
            if (!imageFile) {
              Serial.println("Échec de l'ouverture du fichier image sur la carte SD");
            }
          }
          File imageInFlash = LittleFS.open(image, "w");
          if (!imageInFlash) {
            Serial.println("Échec de l'ouverture du fichier image sur la mémoire flash");
            client.stop();
            return;
          }
          byte buffer[BUFFER_SIZE];  // Taille du buffer à ajuster selon la mémoire disponible
          while (imageSize > 0)
          // Lexture des données d'image et écriture du fichier sur la carte SD
          {
            int len = client.readBytes(buffer, imageSize < sizeof(buffer) ? imageSize : sizeof(buffer));
            if (len <= 0) {
              Serial.println("Erreur de lecture de l'image");
              break;  // Erreur de lecture ou connexion fermée
            }
            if (isSDFunctionning) {
              imageFile.write(buffer, len);
            }
            imageInFlash.write(buffer, len);
            imageSize -= len;
            i++;
            Serial.printf("Bloc %d image sauvegardée sur la carte SD\n Quantité restante: %d\n ", i, imageSize);
            if (imageSize == 0) {
              if (isSDFunctionning) {
                imageFile.close();
              }
              imageInFlash.close();
              Serial.println("Image recues avec succès");
              Serial.println(Firebase.ready());
              Serial.println(!taskCompleted);
              if (Firebase.ready() && !taskCompleted) {
                taskCompleted = true;
                Serial.print("Uploading picture... ");
                destination = "/images/" + String(USER_UID) + "/" + date + ".jpeg";
                // MIME type should be valid to avoid the download problem.
                // The file systems for flash and SD/SDMMC can be changed in FirebaseFS.h.
                if (Firebase.Storage.upload(&fbdo, STORAGE_BUCKET_ID /* Firebase Storage bucket id */,
                                            image /* path to local file */,
                                            mem_storage_type_flash /* memory storage type, mem_storage_type_flash and mem_storage_type_sd */,
                                            destination /* path of remote file stored in the bucket */,
                                            "image/jpeg" /* mime type */,
                                            fcsUploadCallback)) {
                  Serial.printf("\nDownload URL: %s\n", fbdo.downloadURL().c_str());
                } else {
                  Serial.println(fbdo.errorReason());
                }
                /*
                *Envoi du fichier texte sur le firebase storage
                */
                content.set("description", "Nous avons détecté une intrusion dans la zone 1");
                content.set("timestamp", seconds);
                content.set("url", date + +".jpeg");
                content.set("userId", USER_UID);
                String jsonString;
                content.toString(jsonString, true);
                String text = imagesFolder + "/" + date + ".txt";
                destination = "/DonneesIntrusions/" + String(USER_UID) + "/" + date + ".txt";
                if (isSDFunctionning) {
                  textFile = SD.open(text, FILE_WRITE);
                  if (!textFile) {
                    Serial.println("Échec de l'ouverture du fichier texte sur la carte SD");
                    client.stop();
                    return;
                  }
                  textFile.println(jsonString);
                  textFile.close();
                }
                File textInFlash = LittleFS.open(text, "w");
                if (!textInFlash) {
                  Serial.println("Échec de l'ouverture du fichier texte sur la mémoire flash");
                  client.stop();
                  return;
                }
                textInFlash.println(jsonString);
                textInFlash.close();
                if (Firebase.Storage.upload(&fbdo, STORAGE_BUCKET_ID /* Firebase Storage bucket id */,
                                            text /* path to local file */,
                                            mem_storage_type_flash /* memory storage type, mem_storage_type_flash and mem_storage_type_sd */,
                                            destination /* path of remote file stored in the bucket */,
                                            "text/txt" /* mime type */,
                                            fcsUploadCallback)) {
                  Serial.printf("\nDownload URL: %s\n", fbdo.downloadURL().c_str());
                } else {
                  Serial.println(fbdo.errorReason());
                }
                deleteFile(image.c_str());
                deleteFile(text.c_str());
                taskCompleted = false;
              }
            }
          }
          jsonMessage.clear();
          Serial.println("sortie1");
        }
        // Ouvrir un fichier pour écrire les données d'image
        Serial.println("sortie2 ");
      }
    }
  }
}

void printDirectory(File dir, int numTabs) {
  while (true) {

    File entry = dir.openNextFile();
    if (!entry) {
      // no more files
      break;
    }
    for (uint8_t i = 0; i < numTabs; i++) {
      Serial.print('\t');
    }
    Serial.print(entry.name());
    if (entry.isDirectory()) {
      Serial.println("/");
      printDirectory(entry, numTabs + 1);
    } else {
      // files have sizes, directories do not
      Serial.print("\t\t");
      Serial.print(entry.size(), DEC);
      time_t cr = entry.getCreationTime();
      time_t lw = entry.getLastWrite();
      struct tm *tmstruct = localtime(&cr);
      Serial.printf("\tCREATION: %d-%02d-%02d %02d:%02d:%02d", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
      tmstruct = localtime(&lw);
      Serial.printf("\tLAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
    }
    entry.close();
  }
}

void listFilesInDir(File dir, String *fileList, int &fileCount) {
  while (true) {
    File entry = dir.openNextFile();
    if (!entry) {
      // Aucun fichier supplémentaire n'a été trouvé
      break;
    }
    if (!entry.isDirectory()) {
      if (fileList != nullptr) {  // Check if fileList is not a nullptr
        fileList[fileCount] = String(entry.name());
      }
      fileCount++;  // Increment fileCount regardless of fileList being nullptr or not
    }
    entry.close();
  }
}

// The Firebase Storage upload callback function
void fcsUploadCallback(FCS_UploadStatusInfo info) {
  if (info.status == firebase_fcs_upload_status_init) {
    Serial.printf("Uploading file %s (%d) to %s\n", info.localFileName.c_str(), info.fileSize, info.remoteFileName.c_str());
  } else if (info.status == firebase_fcs_upload_status_upload) {
    Serial.printf("Uploaded %d%s, Elapsed time %d ms\n", (int)info.progress, "%", info.elapsedTime);
  } else if (info.status == firebase_fcs_upload_status_complete) {
    Serial.println("Upload completed\n");
    FileMetaInfo meta = fbdo.metaData();
    Serial.printf("Name: %s\n", meta.name.c_str());
    Serial.printf("Bucket: %s\n", meta.bucket.c_str());
    Serial.printf("contentType: %s\n", meta.contentType.c_str());
    Serial.printf("Size: %d\n", meta.size);
    Serial.printf("Generation: %lu\n", meta.generation);
    Serial.printf("Metageneration: %lu\n", meta.metageneration);
    Serial.printf("ETag: %s\n", meta.etag.c_str());
    Serial.printf("CRC32: %s\n", meta.crc32.c_str());
    Serial.printf("Tokens: %s\n", meta.downloadTokens.c_str());
    Serial.printf("Download URL: %s\n\n", fbdo.downloadURL().c_str());
  } else if (info.status == firebase_fcs_upload_status_error) {
    Serial.printf("Upload failed, %s\n", info.errorMsg.c_str());
  }
}

// Définition de la fonction de conversion de timestamp en format DD-MM-YY hh:mm:ss
String timestampToDateString(unsigned long timestamp) {
  char buffer[80];
  std::time_t seconds = static_cast<std::time_t>(timestamp);
  std::tm *timeinfo = std::localtime(&seconds);
  std::strftime(buffer, 80, "%d-%m-%y %H-%M-%S", timeinfo);
  return String(buffer);
}
/* void listDir(const char *dirname) {
  Serial.printf("Listing directory: %s\n", dirname);

  Dir root = LittleFS.openDir(dirname);

  while (root.next()) {
    File file = root.openFile("r");
    Serial.print("  FILE: ");
    Serial.print(root.fileName());
    Serial.print("  SIZE: ");
    Serial.print(file.size());
    time_t cr = file.getCreationTime();
    time_t lw = file.getLastWrite();
    file.close();
    struct tm *tmstruct = localtime(&cr);
    Serial.printf("    CREATION: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
    tmstruct = localtime(&lw);
    Serial.printf("  LAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
  }
} */

void listDir(const char *dirname, uint8_t levels) {
  if (levels == 0) {
    return;
  }

  Serial.printf("Listing directory: %s\n", dirname);

  Dir root = LittleFS.openDir(dirname);

  while (root.next()) {
    File file = root.openFile("r");
    if (file.isDirectory()) {
      Serial.print("  DIR : ");
      Serial.println(root.fileName());
      // Construct the path for the subdirectory and call listDir recursively
      String subDirPath = String(dirname) + "/" + root.fileName();
      listDir(subDirPath.c_str(), levels - 1);  // Decrease the level
    } else {
      Serial.print("  FILE: ");
      Serial.print(root.fileName());
      Serial.print("  SIZE: ");
      Serial.println(file.size());
      // ... (rest of the code to print file details)
    }
    file.close();
  }
}


void readFile(const char *path) {
  Serial.printf("Reading file: %s\n", path);

  File file = LittleFS.open(path, "r");
  if (!file) {
    Serial.println("Failed to open file for reading");
    return;
  }

  Serial.print("Read from file: ");
  while (file.available()) { Serial.write(file.read()); }
  file.close();
}

void writeFile(const char *path, const char *message) {
  Serial.printf("Writing file: %s\n", path);

  File file = LittleFS.open(path, "w");
  if (!file) {
    Serial.println("Failed to open file for writing");
    return;
  }
  if (file.print(message)) {
    Serial.println("File written");
  } else {
    Serial.println("Write failed");
  }
  delay(2000);  // Make sure the CREATE and LASTWRITE times are different
  file.close();
}

void appendFile(const char *path, const char *message) {
  Serial.printf("Appending to file: %s\n", path);

  File file = LittleFS.open(path, "a");
  if (!file) {
    Serial.println("Failed to open file for appending");
    return;
  }
  if (file.print(message)) {
    Serial.println("Message appended");
  } else {
    Serial.println("Append failed");
  }
  file.close();
}

void renameFile(const char *path1, const char *path2) {
  Serial.printf("Renaming file %s to %s\n", path1, path2);
  if (LittleFS.rename(path1, path2)) {
    Serial.println("File renamed");
  } else {
    Serial.println("Rename failed");
  }
}

void deleteFile(const char *path) {
  Serial.printf("Deleting file: %s\n", path);
  if (LittleFS.remove(path)) {
    Serial.println("File deleted");
  } else {
    Serial.println("Delete failed");
  }
}
void fcsDownloadCallback(FCS_DownloadStatusInfo info) {
  if (info.status == firebase_fcs_download_status_init) {
    Serial.printf("Downloading file %s (%d) to %s\n", info.remoteFileName.c_str(), info.fileSize, info.localFileName.c_str());
  } else if (info.status == firebase_fcs_download_status_download) {
    Serial.printf("Downloaded %d%s, Elapsed time %d ms\n", (int)info.progress, "%", info.elapsedTime);
  } else if (info.status == firebase_fcs_download_status_complete) {
    Serial.println("Download completed\n");
  } else if (info.status == firebase_fcs_download_status_error) {
    Serial.printf("Download failed, %s\n", info.errorMsg.c_str());
  }
}
