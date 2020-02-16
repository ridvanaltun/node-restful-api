const user = require('./user');
const auth = require('./auth');

module.exports = {
  user: {
    post: user.post,
    put: user.put,
  },
  auth: {
    login: auth.login,
    logout: auth.logout,
    token: auth.token,
  },
};
