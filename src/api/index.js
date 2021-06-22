const express = require('express')

// resources
const authAPI = require('./auth')
const usersAPI = require('./users')
const requestLogsAPI = require('./request_logs')

module.exports = () => {
  const app = express.Router()

  // register routes
  app.use('/auth', authAPI.routers())
  app.use('/users', usersAPI.routers())
  app.use('/request_logs', requestLogsAPI.routers())

  return app
}
