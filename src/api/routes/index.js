const todo = require('./todo');
const user = require('./user');
const auth = require('./auth');

module.exports = (app) => {
  todo(app);
  user(app);
  auth(app);
};
