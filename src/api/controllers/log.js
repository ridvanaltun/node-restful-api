const Request = require('mongoose').model('Request');
const {paginator} = require('../../lib');

exports.list_all_logs = (req, res, next) => {
  const query = {};
  paginator(Request, 'logs', req, query, (err, logs) => {
    if (err) return next(err);
    res.json(logs);
  });
};


exports.read_a_log = (req, res, next) => {
  const {logId} = req.params;
  Request.findOne({_id: logId}, (err, log) => {
    if (err) return next(err);
    res.json(log);
  });
};
