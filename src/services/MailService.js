const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const { secondsToRemaing } = require('../utils')

// configs
const { email, frontend, app } = require('../configs')
const { smtp, address, passwordActivationTimeout } = email
const { host, port, user, password: pass } = smtp

// mail addresses
const NO_REPLY_ADDRESS = address.noReply

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
  host,
  port,
  auth: {
    user,
    pass
  }
})

const createActivationMail = (name, userId, activationCode) => {
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

/**
 * Mail Service
 */
class MailService {
  /**
   * @description Send activation mail
   * @param {string}  to              Mail to
   * @param {string}  name            Mail reveiver name
   * @param {string}  userId          User id
   * @param {string}  activationCode  Activation code
   */
  async sendActivationMail (to, name, userId, activationCode) {
    try {
      // create mail
      const mail = createActivationMail(name, userId, activationCode)

      // send mail
      await transporter
        .sendMail({
          from: NO_REPLY_ADDRESS,
          to,
          subject: 'Confirm your email at Node',
          html: mail
        })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = MailService
