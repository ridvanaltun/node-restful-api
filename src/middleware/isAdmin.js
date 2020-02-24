const {USER_TYPES} = require('../enums');
const User = require('mongoose').model('User');

module.exports = (req, res, next) => {
  const username = req.username;
  User.findOne({username}, (err, user) => {
    if (err) return next(err);
    const {user_type: USER} = user;
    const IS_ADMIN = USER_TYPES.ADMIN === USER;

    if (!IS_ADMIN) {
      res.status(401);
      res.send({
        code: 401,
        title: 'Unauthorized',
        message: 'Only users at the administrative level can access',
      });
    }

    next();
  });
};
