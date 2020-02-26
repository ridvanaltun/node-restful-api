const todo = require('./routes/todo');
const user = require('./routes/user');
const auth = require('./routes/auth');
const log = require('./routes/log');

const registerRoutes = (app) => {
  todo(app);
  user(app);
  auth(app);
  log(app);
};

module.exports = registerRoutes;
