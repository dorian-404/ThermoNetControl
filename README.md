# ThermoNetControl

ThermoNetControl est un projet de supervision et de pilotage de chauffage multi-zones.
L'objectif est de lire des temperatures depuis un Arduino, de les afficher dans une interface web,
puis de les faire remonter vers une API backend avant d'activer la commande des zones de chauffage.

## Apercu du projet

Le projet est compose de trois parties principales :

- `arduino/` : lecture des capteurs `DHT11` et emission des releves sur le port serie
- `frontend/` : interface web de suivi des zones et connexion a l'Arduino via Web Serial
- `backend/` : API Express qui recoit et conserve les derniers releves par zone

Aujourd'hui, le flux deja en place est le suivant :

1. l'Arduino lit les temperatures de 4 zones
2. le frontend affiche les releves en direct
3. le frontend envoie ces releves au backend
4. le backend conserve la derniere valeur connue pour chaque zone

## Fonctionnalites actuelles

- lecture de 4 capteurs `DHT11` cote Arduino
- emission serie des releves sous la forme `ZONE_1:23.0`
- interface web simplifiee pour suivre les 4 zones
- connexion a l'Arduino depuis le navigateur avec Web Serial
- synchronisation des temperatures du frontend vers l'API backend
- endpoint backend pour recuperer les dernieres temperatures par zone

## Structure du projet

```text
ThermoNetControl/
├── arduino/
│   └── chauffage.ino
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── temperature.routes.js
│   │   ├── controllers/
│   │   │   └── temperature.controller.js
│   │   ├── services/
│   │   │   └── temperature.service.js
│   │   ├── models/
│   │   │   └── temperature.model.js
│   │   ├── config/
│   │   │   └── config.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
├── LICENSE
├── README.md
└── .gitignore
```

## Technologies utilisees

- Arduino / C++
- JavaScript
- Node.js
- Express
- HTML / CSS
- capteurs `DHT11`
- Web Serial API

## Materiel prevu

- 1 carte Arduino
- 4 capteurs `DHT11`
- 4 sorties de commande pour les zones de chauffage
- modules de puissance adaptes a la commande du chauffage
- alimentation et cablage du montage

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

Par defaut, l'API demarre sur `http://localhost:3000`.

### 4. Lancer le frontend

Depuis la racine du projet :

```bash
python3 -m http.server 4173 --directory frontend
```

Le frontend sera alors accessible sur `http://localhost:4173`.

### 5. Televerser le code Arduino

Ouvrir [arduino/chauffage.ino](/Users/mishaelwontcheu/Documents/New%20project/arduino/chauffage.ino) dans l'IDE Arduino, puis :

- installer la librairie `DHT`
- verifier les broches utilisees
- televerser le sketch sur la carte

## Utilisation

1. demarrer le backend
2. ouvrir le frontend dans le navigateur
3. connecter l'Arduino au PC
4. cliquer sur `Connecter l'Arduino`
5. selectionner le port serie de la carte
6. verifier que les 4 zones commencent a afficher des temperatures

Le frontend envoie automatiquement une commande `READ_NOW` apres la connexion pour demander un premier releve.

## API disponible

### `GET /api/temperatures`

Retourne les dernieres temperatures connues par zone.

Exemple de reponse :

```json
{
  "lastReadingAt": "2026-04-02T12:00:00.000Z",
  "zones": [
    { "id": 1, "zone": 1, "value": 23, "createdAt": "2026-04-02T12:00:00.000Z" },
    { "id": 2, "zone": 2, "value": 22, "createdAt": "2026-04-02T12:00:01.000Z" }
  ]
}
```

### `POST /api/temperatures`

Enregistre un releve venant du frontend.

Exemple de payload :

```json
{
  "zone": 1,
  "value": 23.5
}
```

## Etat actuel du projet

### Ce qui fonctionne deja

- lecture multi-zones cote Arduino
- affichage temps reel dans le frontend
- remontée des releves vers le backend
- organisation du projet en couches claires

### Ce qui reste a faire

- persistance en base de donnees
- pilotage reel des sorties chauffage depuis l'interface
- logique de consigne et d'automatisation par zone
- validation complete du montage materiel

## Points de vigilance

- les donnees backend sont actuellement conservees en memoire seulement
- un redemarrage du serveur efface les releves
- la commande de chauffage ne doit pas etre activee sans validation electrique serieuse
- toute partie en `120V AC` doit etre isolee et securisee avec du materiel adapte

## Feuille de route conseillee

1. fiabiliser la lecture des 4 zones
2. conserver les releves dans une vraie base
3. ajouter la commande chauffage zone par zone
4. ajouter les protections et validations materiel

## Auteurs

Projet realise autour du travail de Dorian et Yannis, puis restructure et documente progressivement pour une mise en propre du depot.
