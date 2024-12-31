
#include <HandlerEEPROM.h>
#include <HandlerSocketServer.h>

void setup()
{

  Serial.begin(115200);

  uint8_t macAddress[6];                      // Буфер для хранения MAC-адреса (6 байт)
  esp_read_mac(macAddress, ESP_MAC_WIFI_STA); // Чтение MAC-адреса Wi-Fi станции (ESP32)

  // 0 MY)
  uint8_t targetMacAddress[] = {0xEC,0x64,0xC9,0x5E,0x65,0xFC}; 

  // Вывод полученного MAC-адреса в монитор последовательного порта
  // Serial.print("\nMAC Address: ");
  // for (int i = 0; i < 6; i++)
  // {
  //   Serial.printf("%02X", macAddress[i]); // Вывод каждого байта в шестнадцатеричном виде
  //   if (i < 5)
  //   {
  //     Serial.print(":"); // Добавление двоеточия между байтами (кроме последнего)
  //   }
  // }
  // Serial.println(); // Переход на новую строку

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
