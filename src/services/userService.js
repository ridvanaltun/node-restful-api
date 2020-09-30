const User = require('mongoose').model('User');
const lib = require('../lib');
const EmailService = require('./emailService');
const AuthService = require('./authService');

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
   * @return  {object}            User
   * @throws  {Error}
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
   * @return  {object}        User
   * @throws  {Error}
   */
  async create(body) {
    try {
      // create user
      const user = await new User(body).save();

      // create activation code
      const authClient = new AuthService();
      const activationCode = await authClient.createActivationCode(user.email);

      // send email
      const emailClient = new EmailService();
      const fullName = `${user.first_name} ${user.last_name}`;

      // note: removed await because email server can be slow
      emailClient.sendActivationLink(user.email, fullName, user._id, activationCode);

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
   * @return  {object}            User
   * @throws  {Error}
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
   * @throws {Error}
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
