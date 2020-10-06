const routers = require('./requestLogsRouter');
const controllers = require('./requestLogsController');
const validators = require('./requestLogsValidator');
const errors = require('./requestLogsError');

module.exports = {
  routers,
  controllers,
  validators,
  errors,
};
