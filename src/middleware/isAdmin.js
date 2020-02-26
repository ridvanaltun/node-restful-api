const {USER_ROLES} = require('../enums');
const User = require('mongoose').model('User');

module.exports = (req, res, next) => {
  const username = req.username;
  User.findOne({username}, (err, user) => {
    if (err) return next(err);

    const IS_ADMIN = USER_ROLES.ADMIN === user.role;

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
