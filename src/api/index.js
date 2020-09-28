const {Router: router} = require('express');
const todo = require('./routes/todo');
const user = require('./routes/user');
const auth = require('./routes/auth');
const log = require('./routes/log');

module.exports = () => {
  const app = router();

  // register routes
  todo(app);
  user(app);
  auth(app);
  log(app);

  return app;
};
