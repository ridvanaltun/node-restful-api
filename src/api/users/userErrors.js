const createError = require('http-errors')

exports.userUnauthorized = () => createError.Unauthorized('Token not belong to the user')

exports.userPasswordWrong = () => createError.BadRequest('Password wrong')
