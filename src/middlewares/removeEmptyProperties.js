const omitEmpty = require('omit-empty');

module.exports = () => {
  return function(req, res, next) {
    req.body = omitEmpty(req.body);
    req.params = omitEmpty(req.params);
    req.query = omitEmpty(req.query);
    next();
  };
};
