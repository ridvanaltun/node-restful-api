const mongoose = require('mongoose')
const config = require('../configs')

const schema = new mongoose.Schema({
  email: {
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

module.exports = mongoose.model('ActivationCode', schema)
