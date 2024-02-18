/*Pour la connexion WiFi */
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
/*Pour la connexion de la carte SD */
#include <SD.h>
#include <SPI.h>
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

//Pour la sérialisation
DynamicJsonDocument jsonMessage(1024);
DynamicJsonDocument outgoingJsonMessage(1024);
String outgoingMessage = "";
String imagesFolder = "/espImages";

WiFiServer server(80);
String command;

// Initialisation firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig configF;
String destination;
unsigned long dataMillis = 0;
int count = 0;

bool taskCompleted = false;

//Serveur NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 3600, 60000);  // Le décalage est en secondes (3600 pour GMT+1)
String date;

void fcsUploadCallback(FCS_UploadStatusInfo info);

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
  /* timeClient.update();
  date = timestampToDateString(timeClient.getEpochTime());
  lcd.clear();
  lcd.setCursor(0, 1);
  Serial.println(date); */

  //Initialidation de la carte SD
  if (!SD.begin(4)) {
    Serial.println("Échec de l'initialisation de la carte SD");
    return;
  }
  Serial.println("initialisation done");
  if (!SD.exists(imagesFolder)) {
    if (!SD.mkdir(imagesFolder)) {
      Serial.println("Erreur création de dossier");
      return;
    }
    Serial.println("Dossier créé avec succès");
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
  configF.fcs.upload_buffer_size = 512;
}

void loop() {
  timeClient.update();
  date = timestampToDateString(timeClient.getEpochTime());
  /* lcd.clear();
  lcd.setCursor(0, 1);
  Serial.println(date);
  lcd.print(date); */
  WiFiClient client = server.available();
  if (Serial.available() > 0) {
    command = Serial.readStringUntil('\n');
    if (command == "list;") {
      printDirectory(root, 0);
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
        if (action == "imageEsp") {
          /*Traitement de la reception de l'image*/
          String filename = jsonMessage["filename"];
          size_t imageSize = jsonMessage["size"];
          int i = 0;
          // imageFile = SD.open(imagesFolder + "/" + filename, FILE_WRITE);
          Serial.println("date");
          String image = imagesFolder + "/" + date + ".jpeg";
          Serial.println(image);
          Serial.println(image);
          imageFile = SD.open(image, FILE_WRITE);
          if (!imageFile) {
            Serial.println("Échec de l'ouverture du fichier sur la carte SD");
            client.stop();
            return;
          }
          byte buffer[BUFFER_SIZE];  // Taille du buffer à ajuster selon la mémoire disponible
          while (imageSize > 0)
          // Lexture des données d'image et écriture dans le fichier
          {
            int len = client.readBytes(buffer, imageSize < sizeof(buffer) ? imageSize : sizeof(buffer));
            if (len <= 0) {
              Serial.println("Erreur de lecture de l'image");
              break;  // Erreur de lecture ou connexion fermée
            }
            imageFile.write(buffer, len);
            imageSize -= len;
            Serial.print("Bloc ");
            i++;
            Serial.print(i);
            Serial.println(" image sauvegardée sur la carte SD");
            Serial.print("Taille restante: ");
            Serial.println(imageSize);
            if (imageSize == 0) {
              Serial.println("Image recues avec succès");
              Serial.println(Firebase.ready());
              Serial.println(!taskCompleted);
              if (Firebase.ready() && !taskCompleted) {
                taskCompleted = true;
                Serial.print("Uploading picture... ");
                destination = "/images/" + String(USER_UID) + "/" + date + ".jpeg";
                // MIME type should be valid to avoid the download problem.
                // The file systems for flash and SD/SDMMC can be changed in FirebaseFS.h.
                if (Firebase.Storage.upload(&fbdo, STORAGE_BUCKET_ID /* Firebase Storage bucket id */, image /* path to local file */, mem_storage_type_sd /* memory storage type, mem_storage_type_flash and mem_storage_type_sd */, destination /* path of remote file stored in the bucket */, "image/jpeg" /* mime type */, fcsUploadCallback)) {
                  Serial.printf("\nDownload URL: %s\n", fbdo.downloadURL().c_str());
                } else {
                  Serial.println(fbdo.errorReason());
                }
              }
              if (Firebase.ready() && (millis() - dataMillis > 60000 || dataMillis == 0)) {
                dataMillis = millis();
                Serial.println("1");
                FirebaseJson content;

                String documentPath = "requetes/";  //+ String(count);
                Serial.println("2");
                content.set("test", "Hello");
                count++;
                Serial.println("3");

                Serial.print("Create a document... ");
                Serial.println("4");
                Serial.println(documentPath.c_str());
                Serial.println(content.raw());

                if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "" /* databaseId can be (default) or empty */, documentPath.c_str(), content.raw())) {
                  Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
                  Serial.println("5");
                } else {
                  Serial.println("6");
                  Serial.println(fbdo.errorReason());
                }
                Serial.println("7");
              }
            }
          }
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