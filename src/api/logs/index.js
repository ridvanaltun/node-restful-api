const routers = require('./logsRouter');
const controllers = require('./logsController');
const validators = require('./logsValidator');
const errors = require('./logsError');

module.exports = {
  routers,
  controllers,
  validators,
  errors,
};
