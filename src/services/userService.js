const User = require('mongoose').model('User');
const createError = require('http-errors');
const EmailService = require('./emailService');
const AuthService = require('./authService');
const {paginateQueries} = require('../utils');

/**
 * User service
 */
class UserService {
  /**
   * Fetch all users
   *
   * @param   {object}  query  Request query
   *
   * @return  {onject}         Users
   * @throws  {Error}
   */
  async getAll(query) {
    try {
      // create paginated result
      const paginate = await User.paginate({}, paginateQueries('users', query));

      // convert user object to profile
      const usersProfile = paginate.users.map((user) => user.toProfileJSON());
      paginate.users = usersProfile;

      return {users: paginate};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Fetch one user by username
   *
   * @param   {string}  username  Username
   *
   * @return  {object}            User
   * @throws  {Error}
   */
  async getOneByUsername(username) {
    try {
      const user = await User.findOne({username});

      if (!user) return {error: createError.NotFound('User not found')};

      return {user: user.toProfileJSON()};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Fetch one user by id
   *
   * @param   {string}  id  User id
   *
   * @return  {object}      User
   * @throws  {Error}
   */
  async getOneById(id) {
    try {
      const user = await User.findById(id);

      if (!user) return {error: createError.NotFound('User not found')};

      return {user: user.toProfileJSON()};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Create an user
   *
   * @param   {object}  body  User body
   *
   * @return  {object}        Serilized user object, access and refresh token
   * @throws  {Error}
   */
  async create(body) {
    try {
      // create user
      const user = new User(body);
      await user.setPassword(body.password);
      await user.save();

      const {access, refresh} = user.generateJWT();

      // create activation code
      const authClient = new AuthService();
      const activationCode = await authClient.createActivationCode(user.email);

      // send email
      const emailClient = new EmailService();
      const fullName = `${user.first_name} ${user.last_name}`;

      // note: removed await because email server can be slow
      emailClient.sendActivationLink(user.email, fullName, user._id, activationCode);

      return {user: user.toProfileJSON(), access, refresh};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Update an user
   *
   * @param   {string}  username  Username
   * @param   {object}  body      User body
   *
   * @return  {object}            User
   * @throws  {Error}
   */
  async update({username, body}) {
    try {
      const user = await User.findOneAndUpdate({username}, body, {new: true});
      return {user: user.toProfileJSON()};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Delete an user
   *
   * @param   {string}  username  Username
   *
   * @return  {boolean}           false
   * @throws  {Error}
   */
  async delete(username) {
    try {
      await User.deleteOne({username});
      return {error: false};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Update an user
   *
   * @param   {string}  username      Username
   * @param   {string}  newPassword   New password
   *
   * @return  {object}                User
   * @throws  {Error}
   */
  async changePassword(username, newPassword) {
    try {
      const user = await User.findOne({username});
      await user.setPassword(newPassword);
      await user.save();
      return {user: user.toProfileJSON()};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Follow an user
   *
   * @param   {string}  followerUserId    Follower user id
   * @param   {string}  targetUserId      Target user id
   */
  async followUser(followerUserId, targetUserId) {
    const user = await User.findById(followerUserId);
    user.follow(targetUserId);
  }

  /**
   * Unfollow an user
   *
   * @param   {string}  unfollowerUserId  Unfollower user id
   * @param   {string}  targetUserId      Target user id
   */
  async unfollowUser(unfollowerUserId, targetUserId) {
    const user = await User.findById(unfollowerUserId);
    user.unfollow(targetUserId);
  }
}

module.exports = UserService;
