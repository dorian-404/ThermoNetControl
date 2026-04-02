const express = require('express');
const temperatureRoutes = require('./routes/temperature.routes');

const app = express();

app.use(express.json());
app.use('/api/temperatures', temperatureRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erreur interne du serveur.';

  res.status(statusCode).json({ message });
});

module.exports = app;
