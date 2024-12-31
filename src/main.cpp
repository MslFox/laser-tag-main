
#include <HandlerEEPROM.h>
#include <HandlerSocketServer.h>

void setup()
{

  Serial.begin(115200);

  uint8_t macAddress[6];                      // Буфер для хранения MAC-адреса (6 байт)
  esp_read_mac(macAddress, ESP_MAC_WIFI_STA); // Чтение MAC-адреса Wi-Fi станции (ESP32)

  uint8_t targetMacAddress[] = {0xEC, 0x64, 0xC9, 0x5E, 0x65, 0xFC};

  delay(500);
  setup_EEPROM();
  delay(500);
  // NETWORK
  loadNetworkConfig();
// проверка mac
#ifdef MAC_CHECK
  if (memcmp(macAddress, targetMacAddress, 6) == 0)
  {
#endif
    runServer();
    Serial.println("Setup Done");
#ifdef MAC_CHECK
  }
  else
  {
    Serial.println("Setup Failed! Mac address not valid");
  }
#endif
}
void loop()
{
}
