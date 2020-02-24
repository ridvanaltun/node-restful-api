const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const {username} = req.body;
  const {JWT_ACCESS_TOKEN_SECRET} = process.env;
  const options = {expiresIn: '1d'};
  jwt.sign({username}, JWT_ACCESS_TOKEN_SECRET, options, (err, token) => {
    if (err) {
      res.status(400);
      res.send({code: 400, error: 'Bad Request'});
    } else {
      req.token = token;
      next();
    }
  });
};
