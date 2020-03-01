const ENUMS = require('../enums');
const config = require('../config');

const isDev = config.app.environment === ENUMS.APP_MODES.DEV;

// Server error handler
module.exports = (err, req, res, next) => {
  res.status(err.status || 500);
  isDev ? res.send({error: err}) : null;
  res.end();
};
