const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const { secondsToRemaing } = require('../utils')

// configs
const { email, frontend, app } = require('../configs')
const { smtp, passwordActivationTimeout } = email

// mail templates
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: app.name,
    link: frontend.address,
    logo: frontend.logoUrl
  }
})

// mail client
const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  auth: {
    user: smtp.user,
    pass: smtp.password
  }
})

/**
 * Mail Service
 */
class MailService {
  /**
   * @description Send email
   * @param {string}  from    From
   * @param {string}  to      Mail to
   * @param {string}  subject Mail subject
   * @param {object}  mail    HTML mail object
   */
  async sendMail (from, to, subject, mail) {
    try {
      // send mail
      await transporter
        .sendMail({
          from,
          to,
          subject,
          html: mail
        })
    } catch (error) {
      // todo: handle email errors
      console.log(error)
    }
  }

  /**
   * @description Create activation mail object
   * @param   {string}  name            User full name
   * @param   {string}  userId          User id
   * @param   {string}  ActivationCode  Mail activation code
   * @return  {object}                  Activation mail object
   */
  createActivationMail (name, userId, activationCode) {
    const { address, emailVerificationPath } = frontend
    const remaining = secondsToRemaing(passwordActivationTimeout)

    return mailGenerator.generate({
      body: {
        name,
        intro: `Welcome to ${app.name}! We're very excited to have you on board.`,
        action: {
          instructions: `To get started with ${app.name}, please click here:`,
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${address}${emailVerificationPath}/${userId}/${activationCode}`
          }
        },
        outro: `Activation link will expire after ${remaining}.`
      }
    })
  }
}

module.exports = MailService
