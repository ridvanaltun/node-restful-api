const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: /^[a-zA-Z0-9]+$/,
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: /\S+@\S+\.\S+/,
  },
  first_name: {
    type: String,
    trim: true,
    required: true,
    match: /^[a-zA-Z]+$/,
  },
  last_name: {
    type: String,
    trim: true,
    required: true,
    match: /^[a-zA-Z]+$/,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
});

// pagination support
userSchema.plugin(mongoosePaginate);

// unique validator support
userSchema.plugin(uniqueValidator, {message: '{PATH} is already taken.'});

// this will add created_at and updated_at timestamps
userSchema.set('timestamps', {createdAt: 'created_at', updatedAt: 'updated_at'});

module.exports = mongoose.model('User', userSchema);
