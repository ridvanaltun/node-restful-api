const errors = require('./requestLogErrors');
const {RequestLogService} = require('../../services');

const service = new RequestLogService();

exports.listLogs = async (req, res, next) => {
  const {requestLogs, error} = await service.getAll(req.query);

  if (error) return next(error);

  res.json(requestLogs);
};


exports.readLog = async (req, res, next) => {
  const {logId} = req.params;

  const {requestLog, error} = await service.getOneById(logId);

  if (error) return next(error);
  if (!requestLog) return next(errors.requestLogNotFound());

  res.json(requestLog);
};
