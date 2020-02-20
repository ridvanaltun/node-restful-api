const common = require('./common');
const user = require('./user');
const auth = require('./auth');

module.exports = {
  common: {
    list: common.list,
  },
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
