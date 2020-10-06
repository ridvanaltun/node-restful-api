const {UserService} = require('../../services');

const service = new UserService();


// bind user to req.profile
exports.username = async (req, res, next, username) => {
  // get user
  const {user, error} = await service.getOneByUsername(username);

  // handle errors
  if (error) return next(error);

  // bind
  req.profile = user;

  return next();
};
