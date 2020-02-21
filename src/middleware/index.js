const isAdmin = require('./isAdmin');
const ignoreFavicon = require('./ignoreFavicon');
const clientErrorHandler = require('./clientErrorHandler');
const serverErrorHandler = require('./serverErrorHandler');
const notFoundHandler = require('./notFoundHandler');
const logErrors = require('./logErrors');
const verifyToken = require('./verifyToken');
const signToken = require('./signToken');
const removeEmptyProperties = require('./removeEmptyProperties');

module.exports = {
  isAdmin,
  ignoreFavicon,
  clientErrorHandler,
  serverErrorHandler,
  notFoundHandler,
  logErrors,
  verifyToken,
  signToken,
  removeEmptyProperties,
};
