const User = require('mongoose').model('User');
const { jwtUtils, handleMongooseErr } = require('../../lib');

exports.login = (req, res) => {
  User.find({ username: req.body.username }, (err, task) => {
    handleMongooseErr(err, res);
    if (task.length === 0) {
      res.status(401);
      res.send({ code: 401, error: 'Username or password incorrect' });
      res.end();
    } else {
      jwtUtils.signToken(req, res, (token) => {
        res.set('X-Subject-Token', token);
        res.json(task);
      });
    }
  });
};

exports.logout = (req, res) => {
  // TODO: ADD LOGIC
};

exports.token = (req, res) => {
  // TODO: ADD LOGIC
};
