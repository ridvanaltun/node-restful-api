const errors = require('./userErrors');
const {UserService} = require('../../services');

const service = new UserService();

exports.listUsers = async (req, res, next) => {
  const {users, error} = await service.getAll(req.query);

  if (error) return next(error);

  res.json(users);
};


exports.createUser = async (req, res, next) => {
  const {user, error} = await service.create({...req.body});

  if (error) return next(error);

  const {access, refresh} = user.generateJWT();

  // bind tokens to response
  res.set('X-Access-Token', access);
  res.set('X-Refresh-Token', refresh);

  res.status(201).json(user);
};


exports.readUser = async (req, res, next) => {
  const {username} = req.params;

  const {user, error} = await service.getOneByUsername(username);

  if (error) return next(error);
  if (!user) return next(errors.userNotFound());

  res.json(user);
};


exports.updateUser = async (req, res, next) => {
  const {username} = req.params;

  // usernames not match, means this user not belong to token owner
  if (username !== req.user.username) return next(errors.userUnauthorized());

  const {user, error} = await service.update({username, body: req.body});

  if (error) return next(error);

  res.json(user);
};


exports.deleteUser = async (req, res, next) => {
  const {username} = req.params;

  // usernames not match, means this user not belong to token owner
  if (username !== req.user.username) return next(errors.userUnauthorized());

  const {error} = await service.delete(username);

  if (error) return next(error);

  res.status(204).end();
};

// todo: add email verification
exports.updatePassword = async (req, res, next) => {
  const {username} = req.params;
  const {password, new_password: newPassword} = req.body;

  // usernames not match, means this user not belong to token owner
  if (username !== req.user.username) return next(errors.userUnauthorized());

  // validate password
  const isPasswordCorrect = await req.user.isPasswordCorrect(password);

  // password not correct
  if (!isPasswordCorrect) return next(errors.userPasswordWrong());

  const {user, error} = await service.changePassword(username, newPassword);

  if (error) return next(error);

  res.json(user);
};
