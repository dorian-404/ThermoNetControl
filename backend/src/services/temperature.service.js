const Temperature = require('../models/temperature.model');

async function getLatestTemperature() {
  const latest = Temperature.getLatest();
  const latestByZone = Temperature.getLatestByZone();

  if (!latest) {
    return {
      message: 'Aucune temperature enregistree pour le moment.',
      zones: [],
    };
  }

  return {
    // On renvoie la derniere lecture globale, ainsi que la derniere valeur connue pour chaque zone.
    lastReadingAt: latest.createdAt,
    zones: latestByZone,
  };
}

async function saveTemperature(payload) {
  if (!payload || payload.zone === undefined || payload.zone === null || payload.zone === '') {
    const error = new Error('Le numero de zone est obligatoire.');
    error.statusCode = 400;
    throw error;
  }

  if (!payload || payload.value === undefined || payload.value === null || payload.value === '') {
    const error = new Error('La valeur de temperature est obligatoire.');
    error.statusCode = 400;
    throw error;
  }

  const parsedZone = Number(payload.zone);
  const parsedValue = Number(payload.value);

  if (!Number.isInteger(parsedZone) || parsedZone < 1) {
    const error = new Error('La zone doit etre un entier positif.');
    error.statusCode = 400;
    throw error;
  }

  if (Number.isNaN(parsedValue)) {
    const error = new Error('La temperature doit etre un nombre valide.');
    error.statusCode = 400;
    throw error;
  }

  return Temperature.create({
    zone: parsedZone,
    value: parsedValue,
  });
}

module.exports = {
  getLatestTemperature,
  saveTemperature,
};
