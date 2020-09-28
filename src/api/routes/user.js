const {Router: router} = require('express');
const handle = require('../controllers/user');
const validate = require('../validations/user');
const validateCommon = require('../validations/common');
const middleware = require('../../middleware');

const route = router();

module.exports = (app) => {
  app.use('/users', route);

  route.route('/')
      .get(validateCommon.pagination, handle.list_all_users)
      .post(validate.create_a_user, middleware.signToken, handle.create_a_user);

  route.route('/:username')
      .get(handle.read_a_user)
      .put(middleware.verifyToken, validate.update_a_user, handle.update_a_user)
      .delete(middleware.verifyToken, handle.delete_a_user);
};
