const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['x-refresh-token'];
  const {JWT_REFRESH_TOKEN_SECRET} = process.env;
  if (typeof token !== 'undefined') {
    jwt.verify(token, JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return next(err);
      req.username = decoded.username;
      next();
    });
  } else {
    // Forbidden
    res.status(403);
    res.send({code: 403, title: 'Forbidden'});
  }
};
