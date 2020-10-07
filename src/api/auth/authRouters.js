const express = require('express')
const controllers = require('./authControllers')
const validator = require('./authValidators')

const auth = express.Router()

auth.route('/login')
  .post(validator.login, controllers.login)

auth.route('/logout')
  .post(validator.logout, controllers.logout)

auth.route('/token')
  .post(validator.createToken, controllers.createToken)

auth.route('/confirmation/email')
  .post(validator.activateEmail, controllers.activateEmail)

auth.route('/resend')
  .post(validator.activateEmailResend, controllers.activateEmailResend)

module.exports = () => auth
