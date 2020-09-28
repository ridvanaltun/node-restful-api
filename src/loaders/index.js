const {Logger} = require('../utils');
const loadModels = require('../models');
const mongooseLoader = require('./mongoose');
const agendaLoader = require('./agenda');

module.exports = async ({expressApp}) => {
  // load models
  loadModels();
  Logger.info('✔️  Models loaded!');

  await mongooseLoader();
  Logger.info('✔️  DB loaded and connected!');

  const agenda = agendaLoader();
  Logger.info('✔️  Agenda loaded!');

  const expressLoader = require('./express');
  await expressLoader({app: expressApp, agenda});
  Logger.info('✔️  Express loaded');
};
