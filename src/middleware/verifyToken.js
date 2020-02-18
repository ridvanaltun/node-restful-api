const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  const {JWT_ACCESS_TOKEN_SECRET} = process.env;
  if (typeof token !== 'undefined') {
    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET, (err) => {
      if (err) {
        res.status(400);
        res.send({code: 400, error: 'JWT token malformed'});
        res.end();
      } else {
        next();
      }
    });
  } else {
    // Forbidden
    res.status(403);
    res.send({code: 403, error: 'Forbidden'});
    res.end();
  }
};
