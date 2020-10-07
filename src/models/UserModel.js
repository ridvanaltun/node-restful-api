const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('../roles');

// configs
const {access, refresh} = require('../configs').secrets.jwt;
const {accessTokenLife, refreshTokenLife} = require('../configs').jwt;

const schema = new mongoose.Schema({
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
  followings: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
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
schema.plugin(mongoosePaginate);

// unique validator support
schema.plugin(uniqueValidator, {message: '{PATH} is already taken.'});

// this will add created_at and updated_at timestamps
schema.set('timestamps', {createdAt: 'created_at', updatedAt: 'updated_at'});

// check password is correct or not
schema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// set user password
schema.methods.setPassword = async function(password) {
  this.password = await bcrypt.hash(password, 10);
};

// check admin role
schema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// check user role
schema.methods.isUser = function() {
  return this.role === 'user';
};

// returns access control object
// ex: user.getAccessController().updateOwn('profile').granted // true or false
schema.methods.getAccessController = function() {
  return roles.can(this.role);
};

// returns profile object
schema.methods.toProfileJSON = function() {
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
schema.methods.generateJWT = function() {
  return {
    access: jwt.sign({id: this._id, role: this.role}, access, {expiresIn: accessTokenLife}),
    refresh: jwt.sign({id: this._id, role: this.role}, refresh, {expiresIn: refreshTokenLife}),
  };
};

// follow given user
schema.methods.follow = function(id) {
  if (this.followings.indexOf(id) === -1) {
    this.followings.push(id);
  }

  return this.save();
};

// unfollow given user
schema.methods.unfollow = function(id) {
  this.followings.remove(id);
  return this.save();
};

// are we following given user
schema.methods.isFollowing = function(id) {
  return this.followings.some(function(followId) {
    return followId.toString() === id.toString();
  });
};

module.exports = mongoose.model('User', schema);