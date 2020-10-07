const express = require('express')
const validator = require('./authValidators')
const {
  login,
  logout,
  createToken,
  activateEmail,
  activateEmailResend
} = require('./authControllers')

const auth = express.Router()

auth.route('/login').post(validator.login, login)

auth.route('/logout').post(validator.logout, logout)

auth.route('/token').post(validator.createToken, createToken)

auth.route('/confirmation/email').post(validator.activateEmail, activateEmail)

auth.route('/resend').post(validator.activateEmailResend, activateEmailResend)

module.exports = () => auth
