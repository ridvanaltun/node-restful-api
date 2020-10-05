const ENUMS = require('../enums');
const configs = require('../configs');

const isDev = configs.app.environment === ENUMS.APP.MODES.DEV;

// Server error handler
module.exports = (err, req, res, next) => {
  res.status(err.status || 500);
  isDev ? res.json({error: err}) : null;
  res.end();
};
