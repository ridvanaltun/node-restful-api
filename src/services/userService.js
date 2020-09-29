const User = require('mongoose').model('User');
const lib = require('../lib');

/**
 * User service
 */
class UserService {
  /**
   * Fetch all users
   *
   * @param   {object}  query  Request query
   *
   * @return  {onject}         Error and users
   */
  async getAll(query) {
    try {
      const options = lib.paginateQueryMongoose('users', query);
      const users = await User.paginate({}, options);
      return {users};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Fetch one user by username
   *
   * @param   {string}  username  Username
   *
   * @return  {object}            Error and user
   */
  async getOneByUsername(username) {
    try {
      const user = await User.findOne({username});
      return {user};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Create an user
   *
   * @param   {object}  body  User body
   *
   * @return  {object}        Error and user
   */
  async create(body) {
    try {
      const user = await new User(body).save();
      // todo: send registration email via EmailService
      return {user};
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
   * @return  {object}            Error and user
   */
  async update({username, body}) {
    try {
      const user = await User.findOneAndUpdate({username}, body, {new: true});
      return {user};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Delete an user
   *
   * @param   {string}  username  Username
   *
   * @return  {object}            Error object, if success = false
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
   * @return  {object}                Error and user
   */
  async changePassword(username, newPassword) {
    try {
      const user = await User.findOneAndUpdate({username}, {password: newPassword});
      return {user};
    } catch (error) {
      return {error};
    }
  }
}

module.exports = UserService;
