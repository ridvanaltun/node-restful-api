const errors = require('./userErrors');

// services
const {UserService} = require('../../services');
const UserServiceInstance = new UserService();

exports.listUsers = async (req, res, next) => {
  const {data, success, error} = await UserServiceInstance.getAll(req.query);

  if (!success) return next(error);

  res.json(data);
};

exports.createUser = async (req, res, next) => {
  const {data, success, error} = await UserServiceInstance.create({...req.body});

  if (!success) return next(error);

  const {user, access, refresh} = data;

  // bind tokens to response
  res.set('X-Access-Token', access);
  res.set('X-Refresh-Token', refresh);

  res.status(201).json(user);
};

exports.readUser = async (req, res, next) => {
  const {username} = req.params;

  const {data, success, error} = await UserServiceInstance.getByUsername(username);

  if (!success) return next(error);

  res.json(data);
};

exports.updateUser = async (req, res, next) => {
  const {username} = req.params;

  // usernames not match, means this user not belong to token owner
  if (username !== req.user.username) return next(errors.userUnauthorized());

  const {data, success, error} = await UserServiceInstance.update({username, body: req.body});

  if (!success) return next(error);

  res.json(data);
};

exports.deleteUser = async (req, res, next) => {
  const {username} = req.params;

  // usernames not match, means this user not belong to token owner
  if (username !== req.user.username) return next(errors.userUnauthorized());

  const {success, error} = await UserServiceInstance.delete(username);

  if (!success) return next(error);

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

  const {data, success, error} = await UserServiceInstance.changePassword(username, newPassword);

  if (!success) return next(error);

  res.json(data);
};

exports.followUser = async (req, res, next) => {
  // target user
  const {id: targetUserId} = req.profile;

  // follower user
  const {id: followerUserId} = req.payload;

  // do it
  const {success, error} = await UserServiceInstance.followUser(targetUserId, followerUserId);

  if(!success) return next(error);

  res.end();
};

exports.unfollowUser = async (req, res, next) => {
  // target user
  const {id: targetUserId} = req.profile;

  // follower user
  const {id: followerUserId} = req.payload;

  // do it
  const {success, error} = await UserServiceInstance.unfollowUser(targetUserId, followerUserId);

  if(!success) return next(error);

  res.status(204).end();
};
