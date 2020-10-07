// services
const { UserService } = require('../../services')
const UserServiceInstance = new UserService()

// bind user to req.profile
exports.username = async (req, res, next, username) => {
  // get user
  const { data, success, error } = await UserServiceInstance.getByUsername(username)

  // handle errors
  if (!success) return next(error)

  // bind
  req.profile = data

  return next()
}
