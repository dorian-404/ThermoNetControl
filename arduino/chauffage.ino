// Monitoring multi-zones du chauffage maison.
// Lecture de 4 capteurs DHT11 et envoi des temperatures sur le port serie.
// Les sorties chauffage sont preparees pour un pilotage ulterieur.

#include <DHT.h>

#define DHT_TYPE DHT11

const int ZONE_COUNT = 4;
const unsigned long READ_INTERVAL_MS = 3000;

const int DHT_PINS[ZONE_COUNT] = {A0, A1, A2, A3};
const int HEATER_PINS[ZONE_COUNT] = {2, 3, 4, 5};

float lastTemperatures[ZONE_COUNT] = {NAN, NAN, NAN, NAN};
unsigned long lastReadAt = 0;

DHT dhtZone1(DHT_PINS[0], DHT_TYPE);
DHT dhtZone2(DHT_PINS[1], DHT_TYPE);
DHT dhtZone3(DHT_PINS[2], DHT_TYPE);
DHT dhtZone4(DHT_PINS[3], DHT_TYPE);

DHT* dhtSensors[ZONE_COUNT] = {
  &dhtZone1,
  &dhtZone2,
  &dhtZone3,
  &dhtZone4
};

void beginSensors() {
  for (int index = 0; index < ZONE_COUNT; index++) {
    dhtSensors[index]->begin();
  }
}

void beginHeaters() {
  for (int index = 0; index < ZONE_COUNT; index++) {
    pinMode(HEATER_PINS[index], OUTPUT);
    digitalWrite(HEATER_PINS[index], LOW);
  }
}

void readAllTemperatures() {
  for (int index = 0; index < ZONE_COUNT; index++) {
    float temperature = dhtSensors[index]->readTemperature();

    // On ne remplace pas la derniere valeur connue si le capteur renvoie une lecture invalide.
    if (!isnan(temperature)) {
      lastTemperatures[index] = temperature;
    }
  }
}

void sendTemperatures() {
  for (int index = 0; index < ZONE_COUNT; index++) {
    Serial.print("ZONE_");
    Serial.print(index + 1);
    Serial.print(":");

    if (isnan(lastTemperatures[index])) {
      Serial.println("ERROR");
    } else {
      Serial.println(lastTemperatures[index]);
    }
  }
}

void handleCommand(String command) {
  command.trim();

  if (command == "READ_NOW") {
    readAllTemperatures();
    sendTemperatures();
    return;
  }

  if (command.startsWith("HEATER_ON:")) {
    int zone = command.substring(10).toInt();

    if (zone >= 1 && zone <= ZONE_COUNT) {
      digitalWrite(HEATER_PINS[zone - 1], HIGH);
      Serial.print("HEATER_ON_OK:");
      Serial.println(zone);
      return;
    }
  }

  if (command.startsWith("HEATER_OFF:")) {
    int zone = command.substring(11).toInt();

    if (zone >= 1 && zone <= ZONE_COUNT) {
      digitalWrite(HEATER_PINS[zone - 1], LOW);
      Serial.print("HEATER_OFF_OK:");
      Serial.println(zone);
      return;
    }
  }

  Serial.print("COMMANDE_INCONNUE:");
  Serial.println(command);
}

void setup() {
  Serial.begin(9600);
  beginSensors();
  beginHeaters();
}

void loop() {
  unsigned long now = millis();

  // Envoi periodique pour que l'interface reste a jour meme sans action manuelle.
  if (now - lastReadAt >= READ_INTERVAL_MS) {
    lastReadAt = now;
    readAllTemperatures();
    sendTemperatures();
  }

  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    handleCommand(command);
  }
}
