const mongoose = require('mongoose');
const config = require('../configs');

const ActivationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    expires: config.email.password_activation_timeout, // in seconds
  },
});

module.exports = mongoose.model('ActivationCode', ActivationCodeSchema);
