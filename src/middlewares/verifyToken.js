const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const configs = require('../configs');
const User = require('mongoose').model('User');

module.exports = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];

  // check access token
  if (!accessToken) return next(createError.Forbidden('Access token malformed'));

  // verify access token
  const decoded = jwt.verify(accessToken, configs.secrets.jwt.access);

  // keep user session
  user = await User.findById(decoded.id);

  // if user not exist throw error
  if (!user) return next(createError.Unauthorized('Access token owner not found'));

  // bind user session to request
  req.user = user;

  return next();
};
