const Logger = require('./logger');
const loadModels = require('../models');
const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const agendaLoader = require('./agenda');

module.exports = async ({ expressApp }) => {
  // load models
  loadModels();
  Logger.info('✔️  Models loaded!');

  mongooseLoader();
  Logger.info('✔️  DB loaded and connected!');

  const agenda = agendaLoader();
  Logger.info('✔️  Agenda loaded!');

  await expressLoader({ app: expressApp, agenda });
  Logger.info('✔️  Express loaded');
};
