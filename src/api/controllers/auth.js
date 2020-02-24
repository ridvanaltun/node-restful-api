const User = require('mongoose').model('User');
const jwt = require('jsonwebtoken');
const {password: pw} = require('../../lib');

exports.login = (req, res, next) => {
  const {access, refresh} = req.token;
  const {username, password} = req.body;

  User.findOne({username}, (err, user) => {
    if (err) return next(err);
    if (user) {
      // validate password
      const isPasswordCorrect = pw.validatePassword(password, user.password);

      if (isPasswordCorrect) {
        res.set('X-Access-Token', access);
        res.set('X-Refresh-Token', refresh);
        res.json(user);
      }

      // when password wrong
      res.status(400);
      res.send({code: 400, title: 'Bad Request', message: 'Password incorrect'});
    } else {
      res.status(404);
      res.send({code: 404, title: 'Not Found', message: 'User not found'});
    }
  });
};

exports.logout = (req, res, next) => {
  // TODO: ADD LOGIC
};

exports.token = (req, res, next) => {
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
