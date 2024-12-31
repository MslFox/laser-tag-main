#include <DNSServer.h>
#include <ConstVar.h>
const char *ap_ssid = "LASERTAG-FOX";
const char *ap_password = "123456789";
// Настройки DNS
const byte DNS_PORT = 53;
DNSServer dnsServer;

void setStationMode()
{
   WiFi.softAP(ap_ssid, ap_password);
   digitalWrite(WIFI_LED_PIN, HIGH);
}