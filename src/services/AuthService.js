const createError = require('http-errors')
const cryptoRandomString = require('crypto-random-string')
const { response } = require('../utils')
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
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async validateActivationMailLink (userId, code) {
    try {
      // need for email address
      const user = await User.findById(userId)

      // no user no validate
      if (!user) return response.sendError(createError.NotFound('User not found with given uid'))

      // email address already activated
      if (user.email_verified) return response.sendError(createError.Conflict('Email address already activated'))

      // is activation code exist
      const activationCode = await MailActivationCode.findOne({
        email: user.email,
        code: code
      })

      // no activation code no verify
      if (!activationCode) return response.sendError(createError.NotFound('Activation code not found'))

      // mark user email verified
      await User.updateOne({ email: user.email }, { email_verified: true })

      // delete activation codes on user emails, no need anymore
      await MailActivationCode.deleteMany({ email: user.email })

      return response.sendSuccess(true)
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Send activation email
   * @param   {string}  to              Reveiver email address
   * @param   {string}  name            Receiver full name
   * @param   {string}  userId          Receiver user id
   * @param   {string}  activationCode  Mail activation code
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async sendActivationMail (to, name, userId, activationCode) {
    try {
      const subject = 'Confirm your email at Node'
      const mail = this.MailServiceInstance.createActivationMail(name, userId, activationCode)

      await this.MailServiceInstance.sendMail(noReply, to, subject, mail)

      return response.sendSuccess(true)
    } catch (error) {
      return response.sendError(error)
    }
  }

  /**
   * @description Resends activation email
   * @param   {string}  email User email
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: boolean}>}
   */
  async resendActivationMail (email) {
    try {
      // find user by email
      const user = await User.findOne({ email })

      // no user no resend
      if (!user) return response.sendError(createError.NotFound('User not found with given email address'))

      // user email already activated
      if (user.email_verified) return response.sendError(createError.Conflict('Email address already activated'))

      // create activation code
      const activationCode = await this.createMailActivationCode(user.email)

      // prepare data for send email
      const fullName = `${user.first_name} ${user.last_name}`

      // send email
      const { success, error } = await this.sendActivationMail(user.email, fullName, user._id, activationCode)

      // return error, sending activation mail fails
      if (!success) return response.sendError(error)

      return response.sendSuccess(true)
    } catch (error) {
      return response.sendError(error)
    }
  }
}

module.exports = AuthService
