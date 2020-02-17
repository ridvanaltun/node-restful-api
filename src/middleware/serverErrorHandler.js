const ENUMS = require('../enums');
const { APP_ENV } = process.env;

const isDev = APP_ENV === ENUMS.APP_MODES.DEV;

// Server error handler
module.exports = (err, req, res, next) => {
  res.status(err.status || 500);
  isDev ? res.send({ error: err }) : null;
  res.end();
};
