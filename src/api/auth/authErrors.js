const createError = require('http-errors')

exports.loginTooManyWrongAttemptsByIpAddress = () => {
  return createError.TooManyRequests('Too many wrong login attempts by this ip address')
}

exports.loginTooManyWrongAttemptsByUserAndIpAddress = () => {
  return createError.TooManyRequests(
    'Too many wrong password provided to the user by this ip address'
  )
}

exports.userNotFound = () => createError.NotFound('User not found')

exports.passwordIncorrect = () => createError.BadRequest('Password incorrect')

exports.refreshTokenRevoked = () => createError.Forbidden('Refresh token revoked')

exports.refreshTokenMalformed = () => createError.Forbidden('Refresh token malformed')
