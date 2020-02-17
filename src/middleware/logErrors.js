const ENUMS = require('../enums');
const { APP_ENV } = process.env;

const isDev = APP_ENV === ENUMS.APP_MODES.DEV;

// Logs errors
module.exports = (err, req, res, next) => {
  isDev ? console.error(err.stack) : null;
  next(err);
};
