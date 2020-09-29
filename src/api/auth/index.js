const routers = require('./authRouter');
const controllers = require('./authController');
const validators = require('./authValidator');
const errors = require('./authError');

module.exports = {
  routers,
  controllers,
  validators,
  errors,
};
