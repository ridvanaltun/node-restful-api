const express = require('express')

// resources
const general = require('./general')
const auth = require('./auth')
const users = require('./users')
const requestLogs = require('./request_logs')

module.exports = () => {
  const app = express.Router()

  // register routes
  app.use('/', general.routers())
  app.use('/auth', auth.routers())
  app.use('/users', users.routers())
  app.use('/request_logs', requestLogs.routers())

  return app
}
