const createError = require('http-errors')

exports.userUnauthorized = () => createError.Unauthorized('User is unauthorized')

exports.userPasswordWrong = () => createError.BadRequest('Password wrong')
