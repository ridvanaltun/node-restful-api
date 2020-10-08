// services
const { UserService } = require('../../services')
const UserServiceInstance = new UserService()

exports.setProfile = async (req, res, next) => {
  // get params
  const { username } = req.params

  // get user
  const { data, success, error } = await UserServiceInstance.getByUsername(username)

  // handle errors
  if (!success) return next(error)

  // bind
  req.profile = data

  next()
}
