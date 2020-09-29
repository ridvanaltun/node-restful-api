const express = require('express');

// resources
const auth = require('./auth');
const users = require('./users');
const tasks = require('./tasks');
const logs = require('./logs');

module.exports = () => {
  const app = express.Router();

  // register routes
  app.use('/auth', auth.routers());
  app.use('/users', users.routers());
  app.use('/tasks', tasks.routers());
  app.use('/logs', logs.routers());

  return app;
};
