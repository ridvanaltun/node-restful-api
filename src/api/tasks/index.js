const routers = require('./tasksRouter');
const controllers = require('./tasksController');
const validators = require('./tasksValidator');
const errors = require('./tasksError');

module.exports = {
  routers,
  controllers,
  validators,
  errors,
};
