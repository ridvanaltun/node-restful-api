const createError = require('http-errors')
const roles = require('../../roles')

// validates given permission
// ex: grantAccess("readOwn", "profile")
module.exports = function (action, resource) {
  return (req, res, next) => {
    // check permission
    const permission = roles.can(req.payload.role)[action](resource)

    // permission not granted
    if (!permission.granted) {
      return next(createError.Unauthorized(
        'You don\'t have enough permission to perform this action'
      ))
    }

    return next()
  }
}
