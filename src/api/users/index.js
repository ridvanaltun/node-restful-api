const routers = require('./usersRouter');
const controllers = require('./usersController');
const validators = require('./usersValidator');
const errors = require('./usersError');

module.exports = {
  routers,
  controllers,
  validators,
  errors,
};
