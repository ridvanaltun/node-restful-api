const Routes = require('./routes');

const registerRoutes = (app) => {
  Routes.todo(app);
  Routes.user(app);
  Routes.auth(app);
};

module.exports = registerRoutes;
