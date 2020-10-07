const cryptoRandomString = require('crypto-random-string')
const { noReply } = require('../configs').email.address

// models
const User = require('mongoose').model('User')
const MailActivationCode = require('mongoose').model('MailActivationCode')

// services
const MailService = require('./MailService')

/**
 * Auth Service
 */
class AuthService {
  /**
   * @description Create service instances
   */
  constructor () {
    this.MailServiceInstance = new MailService()
  }

  /**
   * @description Creates activation code for email address
   * @param   {string}  email User email address
   * @return  {string}        Activation code
   */
  async createMailActivationCode (email) {
    const code = cryptoRandomString({ length: 6 })
    await new MailActivationCode({ email, code }).save()
    return code
  }

  /**
   * @description Validates email activation links
   * @param   {string}  userId  User id
   * @param   {string}  code    A random generated code for user
   * @return  {boolean}         Link valid or not
   */
  async validateActivationMailLink (userId, code) {
    try {
      // need for email address
      const user = await User.findById(userId)

      // no user no validate
      if (!user) return false

      // email address already verified
      if (user.email_verified) return false

      // is activation code exist
      const activationCode = await MailActivationCode.findOne({
        email: user.email,
        code: code
      })

      // no activation code no verify
      if (!activationCode) return false

      // mark user email verified
      await User.updateOne({ email: user.email }, { email_verified: true })

      // delete activation codes on user emails, no need anymore
      await MailActivationCode.deleteMany({ email: user.email })

      // boom
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * @description Send activation email
   * @param {string}  to              Reveiver email address
   * @param {string}  name            Receiver full name
   * @param {string}  userId          Receiver user id
   * @param {string}  activationCode  Mail activation code
   */
  async sendActivationMail (to, name, userId, activationCode) {
    const subject = 'Confirm your email at Node'
    const mail = this.MailServiceInstance.createActivationMail(name, userId, activationCode)
    await this.MailServiceInstance.sendMail(noReply, to, subject, mail)
  }

  /**
   * @description Resends activation email
   * @param   {string}  email User email
   * @return  {boolean}       Success or not
   */
  async resendActivationMail (email) {
    // todo: return verbose for display error reasons in controller
    try {
      // find user by email
      const user = await User.findOne({ email })

      // no user no resend
      if (!user) return false

      // user email already verified
      if (user.email_verified) return false

      // create activation code
      const activationCode = await this.createMailActivationCode(user.email)

      // send email
      const fullName = `${user.first_name} ${user.last_name}`

      // note: removed await because email server can be slow
      this.sendActivationMail(user.email, fullName, user._id, activationCode)

      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = AuthService
