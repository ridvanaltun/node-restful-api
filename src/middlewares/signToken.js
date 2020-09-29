const jwt = require('jsonwebtoken');
const configs = require('../configs');

module.exports = (req, res, next) => {
  const {username} = req.body;

  const accessTokenOptions = {expiresIn: configs.jwt.access_token_life};
  const refreshTokenOptions = {expiresIn: configs.jwt.refresh_token_life};

  // create a access token
  const accessToken = jwt.sign({username}, configs.secrets.jwt.access, accessTokenOptions);
  const refreshToken = jwt.sign({username}, configs.secrets.jwt.refresh, refreshTokenOptions);

  req.token = {
    access: accessToken,
    refresh: refreshToken,
  };

  next();
};
