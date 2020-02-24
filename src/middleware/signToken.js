const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const {username} = req.body;

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

  req.token = {
    access: accessToken,
    refresh: refreshToken,
  };

  next();
};
