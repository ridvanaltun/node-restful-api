const mongoose = require('mongoose')
const config = require('../configs')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    expires: config.email.passwordActivationTimeout // in seconds
  }
})

// remove version key
schema.set('versionKey', false)

module.exports = mongoose.model('ResetPasswordActivationCode', schema)
