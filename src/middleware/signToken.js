const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const {username} = req.body;

  const accessTokenOptions = {expiresIn: config.jwt.access_token_life};
  const refreshTokenOptions = {expiresIn: config.jwt.refresh_token_life};

  // create a access token
  const accessToken = jwt.sign({username}, config.secrets.jwt.access, accessTokenOptions);
  const refreshToken = jwt.sign({username}, config.secrets.jwt.refresh, refreshTokenOptions);

  req.token = {
    access: accessToken,
    refresh: refreshToken,
  };

  next();
};
