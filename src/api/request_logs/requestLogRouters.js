const express = require('express')
const common = require('../common')
const auth = require('../common/auth')
const grantAccess = require('../common/grantAccess')
const { listLogs, readLog } = require('./requestLogControllers')

const requestLogs = express.Router()

requestLogs
  .route('/')
  .get(
    auth.required,
    grantAccess('readAny', 'request_log'),
    common.validators.pagination,
    listLogs
  )

requestLogs
  .route('/:logId')
  .get(
    auth.required,
    grantAccess('readAny', 'request_log'),
    readLog
  )

module.exports = () => requestLogs
