#include <EEPROM.h>
#include <ConstVar.h>

#ifndef HANDLEREEPROM_H
#define HANDLEREEPROM_H

void setup_EEPROM()
{
    EEPROM.begin(1024);
}

void saveNetworkConfig()
{
    EEPROM.put(NETWORK_EEPROM_ADDRESS, NETWORK_SETTINGS);
    EEPROM.commit();
}
void loadNetworkConfig()
{
    EEPROM.get(NETWORK_EEPROM_ADDRESS, NETWORK_SETTINGS);
}

void setDefaultEEPROM()
{
    NETWORK_SETTINGS.ssid = "default";
    NETWORK_SETTINGS.password = "default";
    NETWORK_SETTINGS.id = 0;
    saveNetworkConfig();
};

#endif
