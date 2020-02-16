const Logger = require('./logger');
const loadModels = require('../models');
const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');

module.exports = async ({ expressApp }) => {
  // load models
  loadModels();
  Logger.info('✔️  Models loaded!');

  mongooseLoader();
  Logger.info('✔️  DB loaded and connected!');

  await expressLoader({ app: expressApp });
  Logger.info('✔️  Express loaded');
};
