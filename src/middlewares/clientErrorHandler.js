const { isCelebrateError } = require('celebrate')

// Handle client errors
module.exports = (err, req, res, next) => {
  // Handle mongoose errors
  if (err.name === 'MongoError') return handleMongooseErrors(err, res)

  // Handle mongoose-unique-validator errors
  if (err.name === 'ValidationError') return handleMongooseDublicationErrors(err, res)

  // Custom celebrate error handler
  if (isCelebrateError(err)) return handleCelebrateErrors(err, res)

  // Handle jwt errors
  const jwtErrors = ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError']
  if (jwtErrors.includes(err.name)) return handleJwtErrors(err, res)

  // Handle http errors
  if (err.status) return res.status(err.status).json({ ...err })

  // Pass error to server error handler
  next(err)
}

const handleMongooseErrors = (err, res) => {
  switch (err.code) {
    case 11000: // handle duplicate key error
      res.status(409).json({ code: err.code, message: err.errmsg })
      break
    default:
      res.status(418).json({ code: err.code, message: err.errmsg })
      break
  }
}

const handleMongooseDublicationErrors = (err, res) => {
  res.status(422).json({
    message: err.message,
    errors: Object.keys(err.errors).reduce(function (errors, key) {
      errors[key] = err.errors[key].message

      return errors
    }, {})
  })
}

const handleCelebrateErrors = (err, res) => {
  const errors = {}

  err.details.forEach((item, key) => {
    const path = item.details[0].path.join('.')
    const message = item.details[0].message

    errors[path] = message
  })

  res.status(400).json({
    message: err.message,
    errors: errors
  })
}

const handleJwtErrors = (err, res) => {
  switch (err.name) {
    case 'TokenExpiredError':
      res.status(401).json({ message: 'Token expired' })
      break
    case 'JsonWebTokenError':
      res.status(400).json({ message: 'Token malformed' })
      break
    case 'NotBeforeError':
      res.status(400).json({ message: 'Token not active' })
      break
  }
}
