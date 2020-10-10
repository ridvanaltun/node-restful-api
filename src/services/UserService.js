const createError = require('http-errors')
const { paginateQueries, response } = require('../utils')

// models
const User = require('mongoose').model('User')

// services
const MailService = require('./MailService')
const AuthService = require('./AuthService')

/**
 * User Service
 */
class UserService {
  /**
   * @description Create service instances
   */
  constructor () {
    this.MailServiceInstance = new MailService()
    this.AuthServiceInstance = new AuthService()
  }

  /**
   * @description Fetch all users
   * @param   {object}  query Request query
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: *}>}
   */
  async getAll (query) {
    try {
      // create paginated result
      const paginate = await User.paginate({}, paginateQueries('users', query))

      // convert user object to profile
      const usersProfile = paginate.users.map((user) => user.toProfileJSON())
      paginate.users = usersProfile

      return response.sendSuccess(paginate)
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Retrieve one user by username
   * @param   {string}  username  Username
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: *}>}
   */
  async getByUsername (username) {
    try {
      const user = await User.findOne({ username })

      if (!user) return response.sendError(createError.NotFound('User not found'))

      return response.sendSuccess(user.toProfileJSON())
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Fetch one user by id
   * @param   {string}  id  User id
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: *}>}
   */
  async getById (id) {
    try {
      const user = await User.findById(id)

      if (!user) return response.sendError(createError.NotFound('User not found'))

      return response.sendSuccess(user.toProfileJSON())
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Create an user
   * @param   {object}  body  User body
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: *}>}
   */
  async create (body) {
    try {
      // create user
      const user = new User(body)
      await user.setPassword(body.password)
      await user.save()

      const { access, refresh } = user.generateJWT()

      // create activation code
      const activationCode = await this.AuthServiceInstance.createMailActivationCode(user.email)

      // prepare data for send email
      const fullName = `${user.first_name} ${user.last_name}`

      // send email
      const { success, error } = await this.AuthServiceInstance.sendActivationMail(user.email, fullName, user._id, activationCode)

      // return error, sending activation mail fails
      if (!success) return response.sendError(error)

      return response.sendSuccess({
        user: user.toProfileJSON(),
        tokens: {
          access_token: access,
          refresh_token: refresh
        }
      })
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Update an user
   * @param   {string}  username  Username
   * @param   {object}  body      User body
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: *}>}
   */
  async update (username, body) {
    try {
      const user = await User.findOneAndUpdate({ username }, body, { new: true })
      return response.sendSuccess(user.toProfileJSON())
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Delete an user
   * @param   {string}  username  Username
   * @return  {boolean}           false
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async delete (username) {
    try {
      await User.deleteOne({ username })
      return response.sendSuccess(true)
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Update an user
   * @param   {string}  username    Username
   * @param   {string}  password    Current password
   * @param   {string}  newPassword New password
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async changePassword (username, password, newPassword) {
    try {
      const user = await User.findOne({ username })

      const isPasswordCorrect = await user.isPasswordCorrect(password)

      if (!isPasswordCorrect) return response.sendError(createError.BadRequest('Password wrong'))

      await user.setPassword(newPassword)
      await user.save()

      return response.sendSuccess(true)
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description List follows for guests
   * @param {string}  id  User id
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async listFollowsForGuest (id) {
    try {
      const user = await User.findById(id)
      const follows = await user.listFollowingsForGuest()

      return response.sendSuccess(follows)
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description List follows for an user
   * @param {string}  id        User id, this user's follow list will return
   * @param {string}  username  Username for followings list
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async listFollowsFor (id, username) {
    try {
      const whoAsk = await User.findOne({ username })
      const user = await User.findById(id)
      const follows = await user.listFollowingsFor(whoAsk)

      return response.sendSuccess(follows)
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Follow an user
   * @param {string}  targetUserId      Target user id
   * @param {string}  followerUserId    Follower user id
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async followUser (targetUserId, followerUserId) {
    try {
      const user = await User.findById(followerUserId)
      user.follow(targetUserId)

      return response.sendSuccess(true)
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Unfollow an user
   * @param   {string}  targetUserId      Target user id
   * @param   {string}  unfollowerUserId  Unfollower user id
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async unfollowUser (targetUserId, unfollowerUserId) {
    try {
      const user = await User.findById(unfollowerUserId)
      user.unfollow(targetUserId)

      return response.sendSuccess(true)
    } catch (error) {
      return response.sendError(error)
    }
  }
}

module.exports = UserService
