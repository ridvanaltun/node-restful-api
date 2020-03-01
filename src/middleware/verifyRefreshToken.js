const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const token = req.headers['x-refresh-token'];
  if (typeof token !== 'undefined') {
    jwt.verify(token, config.secrets.jwt.refresh, (err, decoded) => {
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
