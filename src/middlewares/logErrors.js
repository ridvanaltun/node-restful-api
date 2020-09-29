const ENUMS = require('../enums');
const configs = require('../configs');

const isDev = configs.app.environment === ENUMS.APP.MODES.DEV;

// Logs errors
module.exports = (err, req, res, next) => {
  isDev ? console.error(err.stack) : null;
  next(err);
};
