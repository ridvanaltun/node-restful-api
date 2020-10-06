const express = require('express');
const controllers = require('./requestLogsController');
const common = require('../common');
const auth = require('../common/auth');
const grantAccess = require('../common/grantAccess');

const logs = express.Router();

logs
    .route('/')
    .get(
        auth.required,
        grantAccess('readAny', 'request_log'),
        common.validators.pagination,
        controllers.listLogs,
    );

logs
    .route('/:logId')
    .get(
        auth.required,
        grantAccess('readAny', 'request_log'),
        controllers.readLog,
    );

module.exports = () => logs;
