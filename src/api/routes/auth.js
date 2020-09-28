const {Router: router} = require('express');
const handle = require('../controllers/auth');
const validate = require('../validations/auth');
const middleware = require('../../middleware');

const route = router();

module.exports = (app) => {
  app.use('/auth', route);

  route.route('/login')
      .post(validate.login, middleware.signToken, handle.login);

  route.route('/logout')
      .post(validate.logout, handle.logout);

  route.route('/token')
      .post(validate.create_a_token, middleware.verifyRefreshToken, handle.create_a_token);
};
