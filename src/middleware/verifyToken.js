const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  const {JWT_ACCESS_TOKEN_SECRET} = process.env;
  if (typeof token !== 'undefined') {
    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return next(err);

      if (req.params.username) {
        if (req.params.username === decoded.username) {
          req.username = decoded.username;
          next();
        } else {
          res.status(400);
          const message = 'This token not belong to ' + req.params.username;
          res.send({code: 400, title: 'Bad Request', message});
        }
      } else {
        req.username = decoded.username;
        next();
      }
    });
  } else {
    // Forbidden
    res.status(403);
    res.send({code: 403, title: 'Forbidden'});
  }
};
