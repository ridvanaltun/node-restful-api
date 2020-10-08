const createError = require('http-errors')
const { RESOURCE } = require('../../enums')

// permissions
const profilePermissions = require('../../permissions/profilePermissions')
const requestLogPermissions = require('../../permissions/requestLogPermissions')

const createUnauthorizedResponse = () => createError.Unauthorized(
  'You don\'t have enough permission to perform this action'
)

// ex: authProfile("readOwn")
exports.authProfile = function (action) {
  return (req, res, next) => {
    const permission = profilePermissions.can(req.payload.role)[action](RESOURCE.PROFILE)
    if (!permission.granted) return next(createUnauthorizedResponse())

    next()
  }
}

// ex: authRequestLog("readOwn")
exports.authRequestLog = function (action) {
  return (req, res, next) => {
    const permission = requestLogPermissions.can(req.payload.role)[action](RESOURCE.REQUEST_LOG)
    if (!permission.granted) return next(createUnauthorizedResponse())

    next()
  }
}
