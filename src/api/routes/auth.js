const auth = require('../controllers/auth');
const validate = require('../validations');
const middleware = require('../../middleware');

module.exports = (app) => {
  app.route('/login')
      .post(validate.auth.login, middleware.signToken, auth.login);

  app.route('/logout')
      .post(validate.auth.logout, auth.logout);

  app.route('/token')
      .post(validate.auth.token, middleware.verifyRefreshToken, auth.token);
};
