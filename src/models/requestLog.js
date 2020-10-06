const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ENUMS = require('../enums');

const requestLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [...ENUMS.HTTP_METHODS],
    default: null,
  },
  headers: {
    type: Object,
    default: null,
  },
  query: {
    type: Object,
    default: null,
  },
  params: {
    type: Object,
    default: null,
  },
  body: {
    type: Object,
    default: null,
  },
  endpoint: {
    type: String,
    default: null,
  },
  sender_ip_address: {
    type: String,
    default: null,
  },
  access_token: {
    type: String,
    default: null,
  },
  refresh_token: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// pagination support
requestLogSchema.plugin(mongoosePaginate);

// remove version key
requestLogSchema.set('versionKey', false);

module.exports = mongoose.model('RequestLog', requestLogSchema);
