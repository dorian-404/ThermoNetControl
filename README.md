# ThermoNetControl

ThermoNetControl est un projet de supervision de chauffage multi-zones base sur Arduino, avec une interface web et une petite API Node.js.

Le projet lit les temperatures de 4 zones, les affiche dans une interface front, puis les synchronise vers un backend Express qui conserve les dernieres mesures en memoire.

## Objectif du projet

Le depot sert de base pour un systeme de chauffage domestique capable de :

- lire la temperature de plusieurs zones
- visualiser les releves dans une interface web
- centraliser les mesures dans une API backend
- preparer un futur pilotage des sorties chauffage zone par zone

Aujourd'hui, la lecture des capteurs et la remontee des temperatures sont en place. Le pilotage reel du chauffage est seulement prepare dans le code Arduino.

## Architecture

Le projet est organise en 3 blocs :

```text
ThermoNetControl/
├── arduino/
│   └── chauffage.ino
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── config.js
│       ├── controllers/
│       │   └── temperature.controller.js
│       ├── models/
│       │   └── temperature.model.js
│       ├── routes/
│       │   └── temperature.routes.js
│       └── services/
│           └── temperature.service.js
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
└── README.md
```

## Fonctionnement

### Arduino

Le sketch `arduino/chauffage.ino` :

- lit 4 capteurs `DHT11`
- envoie les temperatures sur le port serie au format `ZONE_n:valeur`
- renvoie `ZONE_n:ERROR` si la lecture est invalide
- accepte la commande serie `READ_NOW`
- prepare aussi les commandes `HEATER_ON:n` et `HEATER_OFF:n`

Configuration actuelle :

- `ZONE_COUNT = 4`
- broches capteurs : `A0`, `A1`, `A2`, `A3`
- broches chauffage : `2`, `3`, `4`, `5`
- vitesse serie : `9600`
- intervalle de lecture automatique : `3000 ms`

### Frontend

Le frontend est une page statique qui :

- se connecte a l'Arduino via la Web Serial API
- affiche les temperatures des 4 zones
- met a jour l'etat de chaque capteur
- envoie chaque mesure valide au backend
- permet de demander une lecture immediate avec le bouton `Lire maintenant`

Important :

- la Web Serial API n'est pas disponible dans tous les navigateurs
- le frontend pointe actuellement vers `http://localhost:3000/api/temperatures`
- la section `Consigne manuelle` met seulement a jour l'etat de l'interface, elle ne pilote pas encore le chauffage reel

### Backend

Le backend Express expose une API simple :

- `GET /api/temperatures`
- `POST /api/temperatures`

Les donnees sont stockees en memoire dans `backend/src/models/temperature.model.js`, donc elles sont perdues au redemarrage du serveur.

## Pre-requis

- Node.js
- npm
- un navigateur compatible Web Serial
- Arduino IDE
- librairie Arduino `DHT`
- 4 capteurs `DHT11`

## Installation

### 1. Cloner le depot

```bash
git clone https://github.com/dorian-404/ThermoNetControl.git
cd ThermoNetControl
```

### 2. Installer le backend

```bash
cd backend
npm install
```

### 3. Lancer le backend

```bash
npm start
```

Le serveur demarre par defaut sur :

```text
http://localhost:3000
```

Vous pouvez aussi changer le port :

```bash
PORT=4000 npm start
```

### 4. Lancer le frontend

Depuis la racine du projet :

```bash
python3 -m http.server 4173 --directory frontend
```

Puis ouvrir :

```text
http://localhost:4173
```

### 5. Televerser le code Arduino

Dans l'IDE Arduino :

1. ouvrir `arduino/chauffage.ino`
2. installer la librairie `DHT`
3. verifier les broches utilisees
4. televerser le sketch sur la carte

## Utilisation

1. demarrer le backend
2. lancer le frontend dans le navigateur
3. brancher l'Arduino en USB
4. cliquer sur `Connecter l'Arduino`
5. choisir le port serie de la carte
6. verifier l'arrivee des releves dans les cartes de zone

Au moment de la connexion, le frontend envoie automatiquement la commande `READ_NOW` pour demander une mesure immediate.

## Format des messages serie

### Messages emis par l'Arduino

```text
ZONE_1:22.5
ZONE_2:23.0
ZONE_3:ERROR
ZONE_4:21.8
```

### Commandes acceptees par l'Arduino

```text
READ_NOW
HEATER_ON:1
HEATER_OFF:1
```

## API

### `GET /api/temperatures`

Retourne la derniere lecture globale ainsi que la derniere valeur connue pour chaque zone.

Exemple de reponse avec donnees :

```json
{
  "lastReadingAt": "2026-04-02T12:00:00.000Z",
  "zones": [
    {
      "id": 1,
      "zone": 1,
      "value": 23,
      "createdAt": "2026-04-02T12:00:00.000Z"
    },
    {
      "id": 2,
      "zone": 2,
      "value": 22.5,
      "createdAt": "2026-04-02T12:00:03.000Z"
    }
  ]
}
```

Exemple si aucune mesure n'a encore ete recue :

```json
{
  "message": "Aucune temperature enregistree pour le moment.",
  "zones": []
}
```

### `POST /api/temperatures`

Enregistre une mesure.

Exemple de requete :

```json
{
  "zone": 1,
  "value": 23.5
}
```

Exemple de reponse :

```json
{
  "id": 1,
  "zone": 1,
  "value": 23.5,
  "createdAt": "2026-04-02T12:00:00.000Z"
}
```

Regles de validation :

- `zone` est obligatoire
- `zone` doit etre un entier positif
- `value` est obligatoire
- `value` doit etre un nombre valide

## Limites actuelles

- les donnees backend ne sont pas persistantes
- aucun systeme d'authentification n'est present
- le frontend suppose que l'API tourne sur `localhost:3000`
- la consigne manuelle n'est pas encore reliee a une logique de chauffage
- le pilotage des sorties chauffage existe cote Arduino, mais pas encore dans le frontend

## Pistes d'amelioration

- ajouter une base de donnees
- historiser les mesures
- permettre le pilotage des relais depuis l'interface
- ajouter des consignes par zone
- ajouter des tests backend
- gerer une configuration front/backend par environnement

## Securite

Si ce projet doit piloter un chauffage reel :

- ne pas connecter directement des charges dangereuses sans materiel adapte
- utiliser des relais ou modules de puissance dimensionnes correctement
- isoler toute partie secteur
- faire valider le montage electrique avant mise en service

## Licence

Ce projet est distribue sous licence `MIT`. Voir le fichier `LICENSE`.
