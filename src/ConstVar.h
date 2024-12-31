#ifndef CONSTVAR_H
#define CONSTVAR_H

#define MAC_CHECK
// EEPROM
#define NETWORK_EEPROM_ADDRESS 10


// Вспомогательная функция для добавления строковых аргументов в String
template <typename T>
void appendToString(String &output, T arg)
{
   output += arg;
}

template <typename T, typename... Args>
void appendToString(String &output, T first, Args... args)
{
   output += first;
   appendToString(output, args...);
}

#define DEBUG_PRINTS(...)                  \
   do                                      \
   {                                       \
      String output;                       \
      appendToString(output, __VA_ARGS__); \
      Serial.println(output);              \
   } while (0)

#define DEBUG_PRINTLN(msg)     \
   Serial.print(msg);          \
   Serial.print(F(" [---][")); \
   Serial.print(__LINE__);     \
   Serial.print(F("] "));      \
   Serial.print(__FILE__);     \
   Serial.print(F(" | "));     \
   Serial.print(__FUNCTION__); \
   Serial.println(F("()"));

// WIFI MODE
#define WIFI_LED_PIN 23
#define WIFI_CLIENT 22
#define WIFI_STATION 33
const uint8_t count_try_connect_wifi_client = 5;
uint8_t WIFI_MODE = WIFI_STATION;

struct NetworkSetting
{
   uint8_t id;
   String ssid;
   String password;
};

// EVENTS
#define WS_EVT_SEND_SCORE 33
// enum AwsEventType :: WS_EVT_SEND_SCORE;




NetworkSetting NETWORK_SETTINGS;
const IPAddress addresses[] = {
    IPAddress(192, 168, 1, 100),
};
#endif
