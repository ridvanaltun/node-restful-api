/* eslint-disable require-jsdoc */
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const {secondsToRemaing} = require('../utils');
const {email, frontend, app} = require('../configs');
const {smtp, address, passwordActivationTimeout} = email;

/**
 * Email service
 */
class EmailService {
  constructor() {
    // server
    const {host, port, user, password: pass} = smtp;

    // addresses
    this.noReplyAddress = address.noReply;

    // email templates
    this.mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: app.name,
        link: frontend.address,
        logo: frontend.logoUrl,
      },
    });

    // email client
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendActivationLink(to, name, userId, activationCode) {
    const {address, emailVerificationPath} = frontend;
    const remaining = secondsToRemaing(passwordActivationTimeout);
    try {
      // create mail
      const mail = this.mailGenerator.generate({
        body: {
          name,
          intro: `Welcome to ${app.name}! We're very excited to have you on board.`,
          action: {
            instructions: `To get started with ${app.name}, please click here:`,
            button: {
              color: '#22BC66', // Optional action button color
              text: 'Confirm your account',
              link: `${address}${emailVerificationPath}/${userId}/${activationCode}`,
            },
          },
          outro: `Activation link will expire after ${remaining}.`,
        },
      });

      // send mail
      await this.transporter
          .sendMail({
            from: this.noReplyAddress,
            to,
            subject: 'Confirm your email at Node',
            html: mail,
          });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = EmailService;
