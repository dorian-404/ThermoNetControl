const express = require('express');
const {
  getTemperature,
  createTemperature,
} = require('../controllers/temperature.controller');

const router = express.Router();

router.get('/', getTemperature);
router.post('/', createTemperature);

module.exports = router;
