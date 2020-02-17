const User = require('mongoose').model('User');
const { jwtUtils } = require('../../lib');

exports.list_all_users = (req, res, next) => {
  User.find({}, (err, task) => {
    if (err) return next(err);
    res.json(task);
  });
};


exports.create_a_user = async (req, res, next) => {
  const newTask = new User(req.body);
  newTask.save((err, task) => {
    if (err) return next(err);
    jwtUtils.signToken(req, res, (token) => {
      res.set('X-Subject-Token', token);
      res.json(task);
    });
  });
};


exports.read_a_user = (req, res, next) => {
  User.find({ username: req.params.username }, (err, task) => {
    if (err) return next(err);
    res.json(task);
  });
};


exports.update_a_user = (req, res, next) => {
  jwtUtils.verifyToken(req, res, () => {
    const { username } = req.params;
    User.findOneAndUpdate({ username }, req.body, { new: true }, (err, task) => {
      if (err) return next(err);
      if (task === null) {
        res.status(404);
        res.send({ code: 404, error: 'User not found' });
        res.end();
      } else {
        res.json(task);
      }
    });
  });
};


exports.delete_a_user = (req, res, next) => {
  jwtUtils.verifyToken(req, res, () => {
    User.remove({
      username: req.params.username,
    }, (err) => {
      if (err) return next(err);
      res.status(204);
      res.send({ message: 'User successfully deleted' });
      res.end();
    });
  });
};
