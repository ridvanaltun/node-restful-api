const express = require('express');
const handle = require('./usersController');
const validators = require('./usersValidator');
const common = require('../common');
const middlewares = require('../../middlewares');

const users = express.Router();

users.route('/')
    .get(common.validators.pagination, handle.list_all_users)
    .post(validators.create_a_user, handle.create_a_user);

users.route('/:username')
    .get(handle.read_a_user)
    .patch(middlewares.verifyToken, validators.update_a_user, handle.update_a_user)
    .delete(middlewares.verifyToken, handle.delete_a_user);

users.route('/:username/password')
    .post(middlewares.verifyToken, validators.update_password, handle.update_password);

module.exports = () => users;
