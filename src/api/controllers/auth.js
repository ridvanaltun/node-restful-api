const User = require('mongoose').model('User');
const jwt = require('jsonwebtoken');
const ex = require('../../exceptions');
const {password: pw} = require('../../lib');

exports.login = (req, res, next) => {
  const {access, refresh} = req.token;
  const {username, password} = req.body;

  User.findOne({username}, async (err, user) => {
    if (err) return next(err);
    if (user) {
      // validate password
      const isPasswordCorrect = await pw.validatePassword(password, user.password);

      // hide password after validation
      user.password = undefined;

      if (isPasswordCorrect) {
        res.set('X-Access-Token', access);
        res.set('X-Refresh-Token', refresh);
        res.send(user);
      } else {
        // when password wrong
        next(new ex.BadRequestError('Password incorrect'));
      }
    } else {
      // when user not found
      next(new ex.NotFoundError('User not found'));
    }
  }).select('+password');
};

exports.logout = (req, res, next) => {
  // TODO: ADD LOGIC
};

exports.create_a_token = (req, res, next) => {
  const {username} = req;

  const {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_LIFE,
    JWT_REFRESH_TOKEN_LIFE,
  } = process.env;

  const accessTokenOptions = {expiresIn: JWT_ACCESS_TOKEN_LIFE};
  const refreshTokenOptions = {expiresIn: JWT_REFRESH_TOKEN_LIFE};

  // create a access token
  const accessToken = jwt.sign({username}, JWT_ACCESS_TOKEN_SECRET, accessTokenOptions);
  const refreshToken = jwt.sign({username}, JWT_REFRESH_TOKEN_SECRET, refreshTokenOptions);

  res.set('X-Access-Token', accessToken);
  res.set('X-Refresh-Token', refreshToken);
  res.end();
};
