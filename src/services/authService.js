const ActivationCode = require('mongoose').model('ActivationCode');
const User = require('mongoose').model('User');
const EmailService = require('./emailService');
const cryptoRandomString = require('crypto-random-string');

/**
 * Auth service
 */
class AuthService {
  /**
   * Creates activation code
   *
   * @param   {string}  email  User email address
   *
   * @return  {string}         Activation code
   */
  async createActivationCode(email) {
    const code = cryptoRandomString({length: 6});
    await new ActivationCode({email, code}).save();
    return code;
  }

  /**
   * Validates activation link
   *
   * @param   {string}  userId  User id
   * @param   {string}  code    A random generated code for user
   *
   * @return  {boolean}         Link valid or not
   */
  async validateActivationLink(userId, code) {
    try {
      // need for email address
      const user = await User.findById(userId);

      // no user no validate
      if (!user) return false;

      // email address already verified
      if (user.email_verified) return false;

      // is activation code exist
      const activationCode = await ActivationCode.findOne({
        email: user.email,
        code: code,
      });

      // no activation code no verify
      if (!activationCode) return false;

      // mark user email verified
      await User.updateOne({email: user.email}, {email_verified: true});

      // delete activation codes on user emails, no need anymore
      await ActivationCode.deleteMany({email: user.email});

      // boom
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Resends activation email
   *
   * @param   {string}  email  User email
   *
   * @return  {boolean}        Success or not
   */
  async resendActivationEmail(email) {
    // todo: return verbose for display error reasons in controller
    try {
      // find user by email
      const user = await User.findOne({email});

      // no user no resend
      if (!user) return false;

      // user email already verified
      if (user.email_verified) return false;

      // create activation code
      const activationCode = await this.createActivationCode(user.email);

      // send email
      const emailClient = new EmailService();
      const fullName = `${user.first_name} ${user.last_name}`;

      // note: removed await because email server can be slow
      emailClient.sendActivationLink(user.email, fullName, user._id, activationCode);

      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = AuthService;
