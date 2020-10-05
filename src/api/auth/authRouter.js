const express = require('express');
const handle = require('./authController');
const validator = require('./authValidator');
const middlewares = require('../../middlewares');

const auth = express.Router();

auth.route('/login')
    .post(validator.login, handle.login);

auth.route('/logout')
    .post(validator.logout, handle.logout);

auth.route('/token')
    .post(validator.create_a_token, middlewares.verifyRefreshToken, handle.create_a_token);

auth.route('/confirmation/email')
    .post(validator.activate_email, handle.activate_email);

auth.route('/resend')
    .post(validator.activate_email_resend, handle.activate_email_resend);

module.exports = () => auth;
