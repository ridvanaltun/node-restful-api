const isAdmin = require('./isAdmin');
const ignoreFavicon = require('./ignoreFavicon');
const clientErrorHandler = require('./clientErrorHandler');
const serverErrorHandler = require('./serverErrorHandler');
const notFoundHandler = require('./notFoundHandler');
const logErrors = require('./logErrors');

module.exports = {
  isAdmin,
  ignoreFavicon,
  clientErrorHandler,
  serverErrorHandler,
  notFoundHandler,
  logErrors,
};
