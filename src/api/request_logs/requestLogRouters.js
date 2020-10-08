const express = require('express')
const common = require('../common')
const auth = require('../common/auth')
const { authRequestLog } = require('../common/access')
const { listLogs, readLog } = require('./requestLogControllers')

const requestLogs = express.Router()

requestLogs
  .route('/')
  .get(auth.required, authRequestLog('readAny'), common.validators.pagination, listLogs)

requestLogs
  .route('/:logId')
  .get(auth.required, authRequestLog('readAny'), readLog)

module.exports = () => requestLogs
