const errors = require('./usersError');
const {UserService} = require('../../services');
const {hash, compare} = require('../../utils/bcrypt');

const service = new UserService();

exports.list_all_users = async (req, res, next) => {
  const {users, error} = await service.getAll(req.query);

  if (error) return next(error);

  res.json(users);
};


exports.create_a_user = async (req, res, next) => {
  const {access, refresh} = req.token;

  // hash password
  const hashedPassword = await hash(req.body.password);

  const {user, error} = await service.create({...req.body, password: hashedPassword});

  if (error) return next(error);

  // bind tokens to response
  res.set('X-Access-Token', access);
  res.set('X-Refresh-Token', refresh);

  // hide password in response
  user.password = undefined;

  res.status(201).json(user);
};


exports.read_a_user = async (req, res, next) => {
  const {username} = req.params;

  const {user, error} = await service.getOneByUsername(username);

  if (error) return next(error);
  if (!user) return next(errors.userNotFound());

  res.json(user);
};


exports.update_a_user = async (req, res, next) => {
  const {username} = req.params;

  // usernames not match, means this user not belong to token owner
  if (username !== req.user.username) return next(errors.userUnauthorized());

  const {user, error} = await service.update({username, body: req.body});

  if (error) return next(error);

  res.json(user);
};


exports.delete_a_user = async (req, res, next) => {
  const {username} = req.params;

  // usernames not match, means this user not belong to token owner
  if (username !== req.user.username) return next(errors.userUnauthorized());

  const {error} = await service.delete(username);

  if (error) return next(error);

  res.status(204).end();
};

// todo: add email verification
exports.update_password = async (req, res, next) => {
  const {username} = req.params;
  const {password, new_password: newPassword} = req.body;

  // usernames not match, means this user not belong to token owner
  if (username !== req.user.username) return next(errors.userUnauthorized());

  // validate password
  const validated = await compare(password, req.user.password);

  // password not valid
  if (!validated) return next(errors.userPasswordWrong());

  // hash new password
  const hashedNewPassword = await hash(newPassword);

  const {user, error} = await service.changePassword(username, hashedNewPassword);

  if (error) return next(error);

  res.json(user);
};
