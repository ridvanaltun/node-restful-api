const ENUMS = require('../enums')
const configs = require('../configs')

const isDev = configs.app.environment === ENUMS.APP.MODES.DEV

// Logs errors
module.exports = (err, req, res, next) => {
  if (isDev) {
    console.log('############################# START ERROR #############################')
    console.error(err.stack)
    console.log('############################## END ERROR ##############################')
  }

  next(err)
}
