const express = require('express');
const controllers = require('./userControllers');
const validators = require('./userValidators');
const params = require('./userParams');
const common = require('../common');
const auth = require('../common/auth');

const users = express.Router();

// preload user profile on routes with ':username' to req.profile
users.param('username', params.username);

users.route('/')
    .get(common.validators.pagination, controllers.listUsers)
    .post(validators.createUser, controllers.createUser);

users.route('/:username')
    .get(controllers.readUser)
    .patch(auth.required, validators.updateUser, controllers.updateUser)
    .delete(auth.required, controllers.deleteUser);

users.route('/:username/password')
    .post(auth.required, validators.updatePassword, controllers.updatePassword);

users.route('/:username/follow')
    .post(auth.required, controllers.followUser)
    .delete(auth.required, controllers.unfollowUser);

module.exports = () => users;
