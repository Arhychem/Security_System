#include <ESP8266WiFi.h>
#include <string>
#include "ArduinoJson-v6.21.4.h"

WiFiClient client;
String hostname = "192.168.164.122";
uint16_t port = 8080;
const int capacity = JSON_OBJECT_SIZE(3);
StaticJsonDocument<capacity> doc;
String message;

void setup() {
  Serial.begin(115200);
  Serial.println();
  WiFi.begin("Galaxy S20 FE 420A", "maxmaxmax");
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Hey Connected, IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Essaie de connexion au serveur");
  doc["from"] = "maxime";
  doc["action"] = "client-hello";
  serializeJson(doc, message);
  if (client.connect(hostname, port)) {
    Serial.println("Connected to the server");
    client.println(message);
  } else {
    Serial.println("Erreur connexion serveur");
    Serial.print(message);
  }
}
void loop() {}