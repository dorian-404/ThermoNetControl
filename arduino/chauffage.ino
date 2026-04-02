// Point d'entree Arduino pour le controle du chauffage maison.

void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    String commande = Serial.readStringUntil('\n');
    Serial.println(commande);
  }
}
