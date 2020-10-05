const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// configs
const {access, refresh} = require('../configs').secrets.jwt;
const {access_token_life, refresh_token_life} = require('../configs').jwt;

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

// check password is correct or not
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// set user password
userSchema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, 10);
};

// check admin role
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// check user role
userSchema.methods.isUser = function() {
  return this.role === 'user';
};

// returns profile object
userSchema.methods.toProfileJSON = function() {
  return {
    id: this._id,
    role: this.role,
    email: this.email,
    username: this.username,
    first_name: this.first_name,
    last_name: this.last_name,
    created_at: this.created_at,
    updated_at: this.updated_at,
    email_verified: this.email_verified,
  };
};

// generates jwt token
userSchema.methods.generateJWT = function() {
  return {
    access: jwt.sign({id: this._id, role: this.role}, access, {expiresIn: access_token_life}),
    refresh: jwt.sign({id: this._id, role: this.role}, refresh, {expiresIn: refresh_token_life}),
  };
};

module.exports = mongoose.model('User', userSchema);
