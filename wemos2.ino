#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <SD.h>
#include "credential.h"
#include "ArduinoJson.h"
#include <SPI.h>
#include <algorithm>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>

const char *ssid = SSID;
const char *password = PASS;
File root;
File imageFile;
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

bool taskCompleted = false;

// use classic HTTP GET and POST requests

void fcsUploadCallback(FCS_UploadStatusInfo info);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print("+");
  }

  Serial.println("");
  Serial.print("Connecté à ");
  Serial.println(ssid);
  Serial.print("Adresse IP: ");
  Serial.println(WiFi.localIP());

  if (!SD.begin(4)) {  // Assurez-vous que la broche CS est correcte pour votre configuration
    Serial.println("Échec de l'initialisation de la carte SD");
    return;
  }
  Serial.println("initialisation done");
  // SD.rmdir(imagesFolder);
  if (!SD.exists(imagesFolder)) {
    if (!SD.mkdir(imagesFolder)) {
      Serial.println("Erreur création de dossier");
      return;
    }
    Serial.println("Dossier créé avec succès");
  }

  root = SD.open("/");
  server.begin();
  // Firebase Init
  configF.api_key = FIREBASE_API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  configF.token_status_callback = tokenStatusCallback;
  Firebase.begin(&configF, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
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
        DeserializationError err = deserializeJson(jsonMessage, incommingMessage);
        if (err) {
          Serial.println("ERROR: ");
          Serial.println(err.c_str());
          return;
        }
        String action = jsonMessage["action"];
        if (action == "imageEsp") {
          String filename = jsonMessage["filename"];
          size_t imageSize = jsonMessage["size"];
          int i = 0;
          // imageFile = SD.open(imagesFolder + "/" + filename, FILE_WRITE);
          String image = "/" + filename;
          imageFile = SD.open(image, FILE_WRITE);
          if (SD.exists(image)) {
            Serial.println("présent111");
          } else {
            Serial.println("bad bad bad bad111");
          }
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
                if (SD.exists(image)) {
                  Serial.println("présent");
                } else {
                  Serial.println("bad bad bad bad");
                  printDirectory(root, 0);
                }
                // MIME type should be valid to avoid the download problem.
                // The file systems for flash and SD/SDMMC can be changed in FirebaseFS.h.
                if (Firebase.Storage.upload(&fbdo, STORAGE_BUCKET_ID /* Firebase Storage bucket id */, image /* path to local file */, mem_storage_type_flash /* memory storage type, mem_storage_type_flash and mem_storage_type_sd */, "/images/sdgsdgsdg/Moi 7.jpeg" /* path of remote file stored in the bucket */, "image/jpeg" /* mime type */, fcsUploadCallback)) {
                  Serial.printf("\nDownload URL: %s\n", fbdo.downloadURL().c_str());
                } else {
                  if (SD.exists(image)) {
                    Serial.println("présent");
                  } else {
                    Serial.println("bad bad bad bad");
                    printDirectory(root, 0);
                  }
                  Serial.println(fbdo.errorReason());
                }
              }
            }
          }
          imageFile.close();
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
