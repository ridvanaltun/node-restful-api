const user = require('../controllers/user');
const validate = require('../validations');

module.exports = (app) => {
  app.route('/users')
      .get(user.list_all_users)
      .post(validate.user.post, user.create_a_user);

  app.route('/users/:username')
      .get(user.read_a_user)
      .put(validate.user.put, user.update_a_user)
      .delete(user.delete_a_user);
};
