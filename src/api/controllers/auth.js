const User = require('mongoose').model('User');
const {password: pw} = require('../../lib');

exports.login = (req, res, next) => {
  const {token} = req;
  const {username, password} = req.body;

  User.findOne({username}, (err, user) => {
    if (err) return next(err);
    if (user) {
      // validate password
      const isPasswordCorrect = pw.validatePassword(password, user.password);

      if (isPasswordCorrect) {
        res.set('X-Subject-Token', token);
        res.json(user);
      }

      // when password wrong
      res.status(400);
      res.send({code: 400, title: 'Bad Request', message: 'Password incorrect'});
    } else {
      res.status(404);
      res.send({code: 404, title: 'Not Found', message: 'User not found'});
    }
  });
};

exports.logout = (req, res, next) => {
  // TODO: ADD LOGIC
};

exports.token = (req, res, next) => {
  // TODO: ADD LOGIC
};
