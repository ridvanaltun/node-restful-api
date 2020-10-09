const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const configs = require('../../configs')

// allow valid access token owners only
// if access token not valid returns 403
// if access token valid fills req.payload with access token payload
exports.required = async (req, res, next) => {
  const accessToken = req.headers['x-access-token']

  // check access token
  if (!accessToken) return next(createError.Forbidden('Access token not found'))

  try {
    // verify access token
    const decoded = jwt.verify(accessToken, configs.secrets.jwt.access)

    // bind jwt payload to req.paylaod
    req.payload = decoded

    // bind access token to req.tokens
    req.tokens = { ...req.tokens, access: accessToken }

    // mark authentication status
    req.authenticated = true

    return next()
  } catch (err) {
    return next(err)
  }
}

// allow valid access token owners and guests (not token owners)
// if access token not valid returns 403
// if access token valid fills req.payload with access token payload
// if access token not provided passes to next middleware
exports.optional = async (req, res, next) => {
  const accessToken = req.headers['x-access-token']

  if (accessToken) {
    try {
    // verify access token
      const decoded = jwt.verify(accessToken, configs.secrets.jwt.access)

      // bind jwt payload to req.paylaod
      req.payload = decoded

      // bind access token to req.tokens
      req.tokens = { ...req.tokens, access: accessToken }

      // mark authentication status
      req.authenticated = true

      return next()
    } catch (err) {
      return next(err)
    }
  }

  next()
}
