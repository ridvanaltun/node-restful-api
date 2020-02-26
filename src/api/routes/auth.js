const handle = require('../controllers/auth');
const validate = require('../validations/auth');
const middleware = require('../../middleware');

module.exports = (app) => {
  app.route('/login')
      .post(validate.login, middleware.signToken, handle.login);

  app.route('/logout')
      .post(validate.logout, handle.logout);

  app.route('/token')
      .post(validate.create_a_token, middleware.verifyRefreshToken, handle.create_a_token);
};
