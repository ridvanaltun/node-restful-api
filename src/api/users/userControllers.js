// services
const { UserService } = require('../../services')
const UserServiceInstance = new UserService()

exports.listUsers = async (req, res, next) => {
  const { data, success, error } = await UserServiceInstance.getAll(req.query)

  if (!success) return next(error)

  res.json(data)
}

exports.createUser = async (req, res, next) => {
  const { data, success, error } = await UserServiceInstance.create({ ...req.body })

  if (!success) return next(error)

  const { user, access, refresh } = data

  // bind tokens to response
  res.set('X-Access-Token', access)
  res.set('X-Refresh-Token', refresh)

  res.status(201).json(user)
}

exports.readUser = async (req, res, next) => {
  const { username } = req.params

  const { data, success, error } = await UserServiceInstance.getByUsername(username)

  if (!success) return next(error)

  res.json(data)
}

exports.updateUser = async (req, res, next) => {
  const { username } = req.params

  const { data, success, error } = await UserServiceInstance.update(username, req.body)

  if (!success) return next(error)

  res.json(data)
}

exports.deleteUser = async (req, res, next) => {
  const { username } = req.params

  const { success, error } = await UserServiceInstance.delete(username)

  if (!success) return next(error)

  res.status(204).end()
}

// todo: add email verification
exports.updatePassword = async (req, res, next) => {
  const { username } = req.params
  const { password, new_password: newPassword } = req.body

  const { data, success, error } = await UserServiceInstance.changePassword(username, password, newPassword)

  if (!success) return next(error)

  res.json(data)
}

exports.listFollows = async (req, res, next) => {
  if (req.authenticated) {
    const { username } = req.payload
    const { id } = req.profile

    // do it
    const { success, data, error } = await UserServiceInstance.listFollowsFor(id, username)

    if (!success) return next(error)

    return res.json(data)
  }

  // guest user
  const { id } = req.profile

  // do it
  const { success, data, error } = await UserServiceInstance.listFollowsForGuest(id)

  if (!success) return next(error)

  return res.json(data)
}

exports.followUser = async (req, res, next) => {
  // target user
  const { id: targetUserId } = req.profile

  // follower user
  const { id: followerUserId } = req.payload

  // do it
  const { success, error } = await UserServiceInstance.followUser(targetUserId, followerUserId)

  if (!success) return next(error)

  res.end()
}

exports.unfollowUser = async (req, res, next) => {
  // target user
  const { id: targetUserId } = req.profile

  // unfollower user
  const { id: unfollowerUserId } = req.payload

  // do it
  const { success, error } = await UserServiceInstance.unfollowUser(targetUserId, unfollowerUserId)

  if (!success) return next(error)

  res.status(204).end()
}
