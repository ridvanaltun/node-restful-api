// services
const { RequestLogService } = require('../../services')
const RequestLogServiceInstance = new RequestLogService()

exports.setRequestLog = async (req, res, next) => {
  const { requestLogId } = req.params

  const { data, success, error } = await RequestLogServiceInstance.getById(requestLogId)

  if (!success) return next(error)

  // bind
  req.requestLog = data

  next()
}
