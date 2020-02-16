const jwt = require('jsonwebtoken');

/**
 * Returns a signed token
 */
const signToken = (req, res, callback) => {
  const { username } = req.body;
  jwt.sign({ username }, process.env.JWT_ACCESS_TOKEN_SECRET, (err, token) => {
    callback(token);
  });
};

/**
 * Verify token
 */
const verifyToken = (req, res, callback) => {
  const token = req.headers['x-auth-token'];
  if (typeof token !== 'undefined') {
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err) => {
      if (err) {
        res.status(400);
        res.send({ code: 400, error: 'JWT token malformed' });
        res.end();
      } else {
        callback();
      }
    });
  } else {
    // Forbidden
    res.status(403);
    res.send({ code: 403, error: 'Forbidden' });
    res.end();
  }
};

module.exports = {
  signToken,
  verifyToken,
};
