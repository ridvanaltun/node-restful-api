const User = require('mongoose').model('User');
const {paginator, password: pw} = require('../../lib');

exports.list_all_users = (req, res, next) => {
  const query = {};
  paginator(User, 'users', req, query, (err, users) => {
    if (err) return next(err);
    res.json(users);
  });
};


exports.create_a_user = async (req, res, next) => {
  try {
    const {password} = req.body;
    const {access, refresh} = req.token;
    const hashedPassword = await pw.hashPassword(password);
    // create a new user
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    // save the user
    newUser.save((err, user) => {
      res.set('X-Access-Token', access);
      res.set('X-Refresh-Token', refresh);

      // hide password in response
      user.password = undefined;

      res.status(201);
      res.json(user);
    });
  } catch (err) {
    next(err);
  }
};


exports.read_a_user = (req, res, next) => {
  const {username} = req.params;
  User.findOne({username}, (err, user) => {
    if (err) return next(err);
    res.json(user);
  });
};


exports.update_a_user = (req, res, next) => {
  const {username} = req.params;
  User.findOneAndUpdate({username}, req.body, {new: true}, (err, user) => {
    if (err) return next(err);
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      res.send({code: 404, error: 'User not found'});
    }
  });
};


exports.delete_a_user = (req, res, next) => {
  const {username} = req.params;
  User.remove({username}, (err) => {
    if (err) return next(err);
    res.status(204);
    res.send({message: 'User successfully deleted'});
  });
};
