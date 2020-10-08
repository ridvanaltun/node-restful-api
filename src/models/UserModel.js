const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const roles = require('../roles')

// configs
const { access, refresh } = require('../configs').secrets.jwt
const { accessTokenLife, refreshTokenLife } = require('../configs').jwt

const schema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: /^[a-zA-Z0-9]+$/
  },
  password: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: /\S+@\S+\.\S+/
  },
  first_name: {
    type: String,
    trim: true,
    required: true,
    match: /^[a-zA-Z]+$/
  },
  last_name: {
    type: String,
    trim: true,
    required: true,
    match: /^[a-zA-Z]+$/
  },
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  role: {
    type: String,
    enum: ['basic', 'admin'],
    default: 'basic'
  },
  email_verified: {
    type: Boolean,
    default: false
  }
})

schema.plugin(mongoosePaginate)

schema.plugin(uniqueValidator, { message: '{PATH} is already taken.' })

schema.set('timestamps', { createdAt: 'created_at', updatedAt: 'updated_at' })

schema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

schema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10)
}

schema.methods.isAdmin = function () {
  return this.role === 'admin'
}

schema.methods.isBasic = function () {
  return this.role === 'basic'
}

schema.methods.isEmailVerified = function () {
  return this.email_verified
}

// returns access control object
// ex: user.getPermissions().updateOwn('profile').granted // true or false
schema.methods.getPermissions = function () {
  return roles.can(this.role)
}

schema.methods.toProfileJSON = function () {
  return {
    id: this._id,
    role: this.role,
    email: this.email,
    username: this.username,
    first_name: this.first_name,
    last_name: this.last_name,
    created_at: this.created_at,
    updated_at: this.updated_at,
    email_verified: this.email_verified
  }
}

schema.methods.toProfileJSONFor = function (user) {
  return {
    email: this.email,
    username: this.username,
    first_name: this.first_name,
    last_name: this.last_name,
    following: user ? user.isFollowing(this._id) : false
  }
}

schema.methods.toProfileJSONForGuest = function () {
  return {
    email: this.email,
    username: this.username,
    first_name: this.first_name,
    last_name: this.last_name
  }
}

schema.methods.generateJWT = function () {
  return {
    access: jwt.sign(
      { id: this._id, username: this.username, role: this.role },
      access,
      { expiresIn: accessTokenLife }
    ),
    refresh: jwt.sign(
      { id: this._id, username: this.username, role: this.role },
      refresh,
      { expiresIn: refreshTokenLife }
    )
  }
}

schema.methods.follow = function (id) {
  if (this.followings.indexOf(id) === -1) {
    this.followings.push(id)
  }

  return this.save()
}

schema.methods.unfollow = function (id) {
  this.followings.remove(id)
  return this.save()
}

schema.methods.isFollowing = function (id) {
  return this.followings.some(function (followId) {
    return followId.toString() === id.toString()
  })
}

schema.methods.listFollowingsForGuest = async function () {
  const result = await this.populate('followings').execPopulate()
  return result.followings.map(following => following.toProfileJSONForGuest())
}

schema.methods.listFollowingsFor = async function (user) {
  const result = await this.populate('followings').execPopulate()
  return result.followings.map(following => following.toProfileJSONFor(user))
}

module.exports = mongoose.model('User', schema)
