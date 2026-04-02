const Temperature = require('../models/temperature.model');

async function getLatestTemperature() {
  const latest = Temperature.getLatest();

  return latest ?? {
    message: 'Aucune temperature enregistree pour le moment.',
  };
}

async function saveTemperature(payload) {
  if (!payload || payload.value === undefined || payload.value === null || payload.value === '') {
    const error = new Error('La valeur de temperature est obligatoire.');
    error.statusCode = 400;
    throw error;
  }

  const parsedValue = Number(payload.value);

  if (Number.isNaN(parsedValue)) {
    const error = new Error('La temperature doit etre un nombre valide.');
    error.statusCode = 400;
    throw error;
  }

  return Temperature.create({ value: parsedValue });
}

module.exports = {
  getLatestTemperature,
  saveTemperature,
};
