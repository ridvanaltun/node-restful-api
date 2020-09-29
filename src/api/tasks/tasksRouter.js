const express = require('express');
const handle = require('./tasksController');
const common = require('../common');

const tasks = express.Router();

tasks.route('/')
    .get(common.validators.pagination, handle.list_all_tasks)
    .post(handle.create_a_task);

tasks.route('/:taskId')
    .get(handle.read_a_task)
    .put(handle.update_a_task)
    .delete(handle.delete_a_task);

module.exports = () => tasks;
