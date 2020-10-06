const express = require('express');
const controllers = require('./usersController');
const validators = require('./usersValidator');
const common = require('../common');
const auth = require('../common/auth');

const users = express.Router();

users.route('/')
    .get(common.validators.pagination, controllers.listUsers)
    .post(validators.createUser, controllers.createUser);

users.route('/:username')
    .get(controllers.readUser)
    .patch(auth.required, validators.updateUser, controllers.updateUser)
    .delete(auth.required, controllers.deleteUser);

users.route('/:username/password')
    .post(auth.required, validators.updatePassword, controllers.updatePassword);

module.exports = () => users;
