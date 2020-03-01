const ENUMS = require('../enums');
const config = require('../config');

const isDev = config.app.environment === ENUMS.APP_MODES.DEV;

// Logs errors
module.exports = (err, req, res, next) => {
  isDev ? console.error(err.stack) : null;
  next(err);
};
