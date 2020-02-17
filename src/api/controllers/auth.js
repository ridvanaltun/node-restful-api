const User = require('mongoose').model('User');
const {jwtUtils} = require('../../lib');

exports.login = (req, res, next) => {
  User.find({username: req.body.username}, (err, task) => {
    if (err) return next(err);
    if (task.length === 0) {
      res.status(401);
      res.send({code: 401, error: 'Username or password incorrect'});
      res.end();
    } else {
      jwtUtils.signToken(req, res, (token) => {
        res.set('X-Subject-Token', token);
        res.json(task);
      });
    }
  });
};

exports.logout = (req, res, next) => {
  // TODO: ADD LOGIC
};

exports.token = (req, res, next) => {
  // TODO: ADD LOGIC
};
