const handle = require('../controllers/auth');
const validate = require('../validations/auth');
const middleware = require('../../middleware');
const limitters = require('../limitters');

module.exports = (app) => {
  app.route('/login')
      .post(
          middleware.rateLimitterMongo(limitters.slowBruteByIP),
          validate.login,
          middleware.signToken,
          handle.login,
      );

  app.route('/logout')
      .post(validate.logout, handle.logout);

  app.route('/token')
      .post(validate.create_a_token, middleware.verifyRefreshToken, handle.create_a_token);
};
