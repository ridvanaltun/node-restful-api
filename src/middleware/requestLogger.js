const Request = require('mongoose').model('Request');
const requestIp = require('request-ip');

module.exports = (returnReqId) => {
  return (req, res, next) => {
    const log = new Request({
      type: req.method,
      headers: req.headers,
      query: req.query,
      params: req.params,
      body: req.body,
      endpoint: req.url,
      sender_ip_address: requestIp.getClientIp(req),
      access_token: req.headers['x-access-token'],
      refresh_token: req.headers['x-refresh-token'],
    });

    log.save((err, data) => {
      if (err) return next(err);
      if (returnReqId) res.set('X-Request-Id', data._id);
      next();
    });
  };
};
