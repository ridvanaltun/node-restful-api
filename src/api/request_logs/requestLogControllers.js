// services
const {RequestLogService} = require('../../services');
const RequestLogServiceInstance = new RequestLogService();

exports.listLogs = async (req, res, next) => {
  const {data, success, error} = await RequestLogServiceInstance.getAll(req.query);

  if (!success) return next(error);

  res.json(data);
};

exports.readLog = async (req, res, next) => {
  const {logId} = req.params;

  const {data, success, error} = await RequestLogServiceInstance.getById(logId);

  if (!success) return next(error);

  res.json(data);
};
