const routers = require('./authRouters')
const controllers = require('./authControllers')
const validators = require('./authValidators')
const errors = require('./authErrors')
const limitters = require('./authLimitters')

module.exports = {
  routers,
  controllers,
  validators,
  errors,
  limitters
}
