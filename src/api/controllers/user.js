const User = require('mongoose').model('User');
const {paginator} = require('../../lib');

exports.list_all_users = (req, res, next) => {
  const query = {};
  paginator(User, 'users', req, query, (err, users) => {
    if (err) return next(err);
    res.json(users);
  });
};


exports.create_a_user = async (req, res, next) => {
  const newTask = new User(req.body);
  const {token} = req;
  newTask.save((err, task) => {
    if (err) return next(err);
    res.set('X-Subject-Token', token);
    res.json(task);
  });
};


exports.read_a_user = (req, res, next) => {
  User.find({username: req.params.username}, (err, task) => {
    if (err) return next(err);
    res.json(task);
  });
};


exports.update_a_user = (req, res, next) => {
  const {username} = req.params;
  User.findOneAndUpdate({username}, req.body, {new: true}, (err, task) => {
    if (err) return next(err);
    if (task === null) {
      res.status(404);
      res.send({code: 404, error: 'User not found'});
      res.end();
    } else {
      res.json(task);
    }
  });
};


exports.delete_a_user = (req, res, next) => {
  User.remove({
    username: req.params.username,
  }, (err) => {
    if (err) return next(err);
    res.status(204);
    res.send({message: 'User successfully deleted'});
    res.end();
  });
};
