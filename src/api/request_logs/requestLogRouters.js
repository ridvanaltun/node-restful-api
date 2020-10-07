const express = require('express')
const controllers = require('./requestLogControllers')
const common = require('../common')
const auth = require('../common/auth')
const grantAccess = require('../common/grantAccess')

const requestLogs = express.Router()

requestLogs
  .route('/')
  .get(
    auth.required,
    grantAccess('readAny', 'request_log'),
    common.validators.pagination,
    controllers.listLogs
  )

requestLogs
  .route('/:logId')
  .get(
    auth.required,
    grantAccess('readAny', 'request_log'),
    controllers.readLog
  )

module.exports = () => requestLogs
