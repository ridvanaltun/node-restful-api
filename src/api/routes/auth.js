const auth = require('../controllers/auth');
const validate = require('../validations');

module.exports = (app) => {
  app.route('/login')
      .post(validate.auth.login, auth.login);

  app.route('/logout')
      .post(validate.auth.logout, auth.logout);

  app.route('/token')
      .post(validate.auth.token, auth.token);
};
