const temperatureService = require('../services/temperature.service');

async function getTemperature(req, res, next) {
  try {
    const data = await temperatureService.getLatestTemperature();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function createTemperature(req, res, next) {
  try {
    const created = await temperatureService.saveTemperature(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTemperature,
  createTemperature,
};
