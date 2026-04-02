# ThermoNetControl

Ce projet porte sur la conception et la realisation d'une application web qui permet de monitorer les parametres de chauffage a partir d'autres appareils connectes a Internet.

## Nouvelle arborescence

```text
projet-chauffage-maison/
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
