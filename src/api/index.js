const todo = require('./routes/todo');
const user = require('./routes/user');
const auth = require('./routes/auth');

const registerRoutes = (app) => {
  todo(app);
  user(app);
  auth(app);
};

module.exports = registerRoutes;
