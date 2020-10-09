const RequestLog = require('mongoose').model('RequestLog')
const requestIp = require('request-ip')

module.exports = (returnReqId) => {
  return async (err, req, res, next) => {
    const log = new RequestLog({
      type: req.method,
      headers: req.headers,
      query: req.query,
      params: req.params,
      body: req.body,
      endpoint: req.url,
      sender_ip_address: requestIp.getClientIp(req),
      access_token: req.headers['x-access-token'],
      refresh_token: req.headers['x-refresh-token']
    })

    try {
      const data = await log.save()
      if (returnReqId) res.set('X-Request-Id', data._id)
    } catch (error) {
      return next(error)
    }

    next(err)
  }
}
