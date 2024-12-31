#ifndef HANDLERSOCKETSERVER_H
#define HANDLERSOCKETSERVER_H
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <SPIFFS.h>
#include <ConstVar.h>
#include <HandlerSTA.h>
#include <HandlerEEPROM.h>

const char *ssid = "omkc889457";
const char *password = "b76ea43d";
IPAddress gw(192, 168, 1, 1);
IPAddress mask(255, 255, 255, 0);
const uint16_t port = 80;

AsyncWebServer server(port);

int counter;

void setup_wifi()
{
   pinMode(WIFI_LED_PIN, OUTPUT);
   IPAddress ip;
   DEBUG_PRINTS("ssid: ", NETWORK_SETTINGS.ssid, " psw:", NETWORK_SETTINGS.password, " id: ", NETWORK_SETTINGS.id);
   ip = IPAddress(192, 168, 1, 100);
   WiFi.begin(NETWORK_SETTINGS.ssid, NETWORK_SETTINGS.password);
   WiFi.config(ip, gw, mask);
   uint8_t try_connect_counter = 0;
   while (WiFi.status() != WL_CONNECTED && try_connect_counter < count_try_connect_wifi_client)
   {
      digitalWrite(WIFI_LED_PIN, HIGH);
      delay(300);
      digitalWrite(WIFI_LED_PIN, LOW);
      delay(300);
      DEBUG_PRINTS("Connecting to WiFi..");
      try_connect_counter++;
   }

   if (WiFi.status() != WL_CONNECTED && try_connect_counter <= count_try_connect_wifi_client)
   {
      setStationMode();
      WIFI_MODE = WIFI_STATION;
   }
   else
      WIFI_MODE = WIFI_CLIENT;

   DEBUG_PRINTS("WiFi ssid: ", WIFI_MODE == WIFI_CLIENT ? WiFi.SSID() : WiFi.softAPSSID(), "  ip: ", WIFI_MODE == WIFI_CLIENT ? WiFi.localIP().toString() : WiFi.softAPIP().toString());
}
void setup_SPIFFS()
{
   if (!SPIFFS.begin(true))
   {
      DEBUG_PRINTLN("Failed to mount file system");
      return;
   }
}
// почитсить
long led_t;
bool con;
bool led;

void runServer()
{
   setup_SPIFFS();
   setup_wifi();
    // JS
   server.on("/js/bootstrap.min.js", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/js/bootstrap.min.js", "text/javascript"); });
   server.on("/js/jquery.min.js", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/js/jquery.min.js", "text/javascript"); });
   server.on("/socket.js", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/socket.js", "text/javascript"); });
   server.on("/common.js", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/common.js", "text/javascript"); });
   server.on("/datas.js", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/datas.js", "text/javascript"); });
   server.on("/base.js", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/base.js", "text/javascript"); });
   server.on("/target.js", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/target.js", "text/javascript"); });

   // CSS
   server.on("/css/bootstrap.min.css", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/css/bootstrap.min.css", "text/css"); });
   server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
             { request->send(SPIFFS, "/style.css", "text/css"); });
   // HTML
   server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
             { DEBUG_PRINTLN("HTTP_GET --> /index");
               request->send(SPIFFS, "/index.html", "text/html"); });

   // WIFI SETTINGS
   server.on("/wifi", HTTP_GET, [](AsyncWebServerRequest *request)
             { DEBUG_PRINTLN("wifi GET");
               request->send(SPIFFS, "/wifi.html", "text/html"); });

   server.on("/wifi", HTTP_OPTIONS, [](AsyncWebServerRequest *request)
             { DEBUG_PRINTLN("wifi OPTION");
                  request->send(200, "text/plain", ""); });
   server.on("/wifi", HTTP_POST, [](AsyncWebServerRequest *request)
             { DEBUG_PRINTLN("wifi POST");
               request->send(200, "text/plain",
                                 "Wi-Fi: " + NETWORK_SETTINGS.ssid + "<br>" +
                                 "Пароль: " + NETWORK_SETTINGS.password + "<br>" +
                                 "ip: 192.168.0.100"); }, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
             {
                String body = "";
                for (size_t i = 0; i < len; i++)
                {
                   body += (char)data[i];
                }
                DEBUG_PRINTS("Received body: ",  body);
                DynamicJsonDocument doc(1024);
                DeserializationError error = deserializeJson(doc, body);
                if (error)
                {
                   DEBUG_PRINTS("deserializeJson() failed: ", error.c_str());
                   return;
                }
                const char *wifiName = doc["wifiName"];
                const char *wifiPassword = doc["wifiPassword"];
                uint8_t deviceId = doc["deviceId"];
                NETWORK_SETTINGS.ssid = wifiName;
                NETWORK_SETTINGS.password = wifiPassword;
                saveNetworkConfig(); });
   server.begin();
   DEBUG_PRINTLN("Server Begin");
   while (true)
   {
      delay(5);
   }
}

#endif