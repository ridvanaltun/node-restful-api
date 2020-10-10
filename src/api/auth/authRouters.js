const express = require('express')
const validator = require('./authValidators')
const common = require('../common')

const {
  login,
  logout,
  createToken,
  activateEmail,
  activateEmailResend,
  forgotPassword,
  resetPassword
} = require('./authControllers')

const auth = express.Router()

auth.route('/login').post(validator.login, login)

auth.route('/logout').post(common.auth.required, validator.logout, logout)

auth.route('/token').post(validator.createToken, createToken)

auth.route('/confirmation/email').post(validator.activateEmail, activateEmail)

auth.route('/resend').post(validator.activateEmailResend, activateEmailResend)

auth.route('/forgot_password').post(validator.forgotPassword, forgotPassword)

auth.route('/reset_password').post(validator.resetPassword, resetPassword)

module.exports = () => auth
