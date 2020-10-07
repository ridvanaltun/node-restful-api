const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const User = require('mongoose').model('User')
const configs = require('../../configs')

// bind jwt payload to req.payload
exports.required = async (req, res, next) => {
  const accessToken = req.headers['x-access-token']

  // check access token
  if (!accessToken) return next(createError.Forbidden('Access token not found'))

  try {
    // verify access token
    const decoded = jwt.verify(accessToken, configs.secrets.jwt.access)

    // bind payload to req.paylaod
    req.payload = decoded

    // keep user session
    const user = await User.findById(decoded.id)

    // if user not exist throw error
    if (!user) return next(createError.Unauthorized('Access token owner not found'))

    // bind user session to request
    req.user = user

    return next()
  } catch (err) {
    return next(err)
  }
}

// bind jwt payload to req.payload if exist
exports.optional = async (req, res, next) => {
  const accessToken = req.headers['x-access-token']

  if (accessToken) {
    try {
    // verify access token
      const decoded = jwt.verify(accessToken, configs.secrets.jwt.access)

      // bind payload to req.paylaod
      req.payload = decoded

      // keep user session
      const user = await User.findById(decoded.id)

      // if user not exist throw error
      if (!user) return next(createError.Unauthorized('Access token owner not found'))

      // bind user session to request
      req.user = user

      return next()
    } catch (err) {
      return next(err)
    }
  }

  return next()
}
