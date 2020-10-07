const ignoreFavicon = require('./ignoreFavicon')
const clientErrorHandler = require('./clientErrorHandler')
const serverErrorHandler = require('./serverErrorHandler')
const notFoundHandler = require('./notFoundHandler')
const consoleLogErrors = require('./consoleLogErrors')
const removeEmptyProperties = require('./removeEmptyProperties')
const requestLogger = require('./requestLogger')
const rateLimitterMongo = require('./rateLimitterMongo')

module.exports = {
  ignoreFavicon,
  clientErrorHandler,
  serverErrorHandler,
  notFoundHandler,
  consoleLogErrors,
  removeEmptyProperties,
  requestLogger,
  rateLimitterMongo
}
