const {logger} = require('../utils');
const loadModels = require('../models');
const mongooseLoader = require('./mongoose');
const agendaLoader = require('./agenda');

module.exports = async ({expressApp}) => {
  loadModels();
  logger.info('✔️  Models loaded!');

  await mongooseLoader();
  logger.info('✔️  DB loaded and connected!');

  const agenda = agendaLoader();
  logger.info('✔️  Agenda loaded!');

  const expressLoader = require('./express');
  await expressLoader({app: expressApp, agenda});
  logger.info('✔️  Express loaded');
};
