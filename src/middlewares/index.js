const isAdmin = require('./isAdmin');
const ignoreFavicon = require('./ignoreFavicon');
const clientErrorHandler = require('./clientErrorHandler');
const serverErrorHandler = require('./serverErrorHandler');
const notFoundHandler = require('./notFoundHandler');
const logErrors = require('./logErrors');
const verifyToken = require('./verifyToken');
const verifyRefreshToken = require('./verifyRefreshToken');
const removeEmptyProperties = require('./removeEmptyProperties');
const requestLogger = require('./requestLogger');
const rateLimitterMongo = require('./rateLimitterMongo');

module.exports = {
  isAdmin,
  ignoreFavicon,
  clientErrorHandler,
  serverErrorHandler,
  notFoundHandler,
  logErrors,
  verifyToken,
  verifyRefreshToken,
  removeEmptyProperties,
  requestLogger,
  rateLimitterMongo,
};
