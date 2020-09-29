const express = require('express');
const handle = require('./logsController');
const common = require('../common');

const logs = express.Router();

logs.route('/')
    .get(common.validators.pagination, handle.list_all_logs);

logs.route('/:logId')
    .get(handle.read_a_log);

module.exports = () => logs;
