/* eslint-disable global-require */

module.exports = () => {
  require('./UserModel')
  require('./RequestLogModel')
  require('./MailActivationCodeModel')
  require('./ResetPasswordActivationCode')
}
