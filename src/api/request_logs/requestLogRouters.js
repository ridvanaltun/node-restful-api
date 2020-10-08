const express = require('express')
const common = require('../common')
const auth = require('../common/auth')
const { setRequestLog } = require('./requestLogPreloaders')
const { authRequestLog } = require('../common/access')
const { listLogs, readLog } = require('./requestLogControllers')

const requestLogs = express.Router()

requestLogs
  .route('/')
  .get(auth.required, authRequestLog('readAny'), common.validators.pagination, listLogs)

requestLogs
  .route('/:requestLogId')
  .get(auth.required, authRequestLog('readAny'), setRequestLog, readLog)

module.exports = () => requestLogs
