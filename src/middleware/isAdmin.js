const User = require('mongoose').model('User');
const ex = require('../exceptions');

const {USER_ROLES} = require('../enums');

module.exports = (req, res, next) => {
  const username = req.username;
  User.findOne({username}, (err, user) => {
    if (err) return next(err);

    const IS_ADMIN = USER_ROLES.ADMIN === user.role;

    if (IS_ADMIN) return next();

    next(new ex.UnauthorizedError('Only users at the administrative level can access'));
  });
};
