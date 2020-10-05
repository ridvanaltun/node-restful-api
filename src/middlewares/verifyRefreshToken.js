const jwt = require('jsonwebtoken');
const configs = require('../configs');

module.exports = (req, res, next) => {
  const token = req.headers['x-refresh-token'];
  if (typeof token !== 'undefined') {
    jwt.verify(token, configs.secrets.jwt.refresh, (err, decoded) => {
      if (err) return next(err);
      req.payload = decoded;
      next();
    });
  } else {
    // Forbidden
    res.status(403);
    res.send({code: 403, title: 'Forbidden'});
  }
};
