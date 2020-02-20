const user = require('../controllers/user');
const validate = require('../validations');
const middleware = require('../../middleware');

module.exports = (app) => {
  app.route('/users')
      .get(validate.common.list, user.list_all_users)
      .post(validate.user.post, middleware.signToken, user.create_a_user);

  app.route('/users/:username')
      .get(user.read_a_user)
      .put(middleware.verifyToken, validate.user.put, user.update_a_user)
      .delete(middleware.verifyToken, user.delete_a_user);
};
