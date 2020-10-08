const routers = require('./userRouters')
const controllers = require('./userControllers')
const validators = require('./userValidators')
const preloaders = require('./userPreloaders')
const errors = require('./userErrors')

module.exports = {
  routers,
  controllers,
  validators,
  preloaders,
  errors
}
