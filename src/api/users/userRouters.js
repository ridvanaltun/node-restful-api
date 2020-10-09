const express = require('express')
const validators = require('./userValidators')
const errors = require('./userErrors')
const common = require('../common')
const auth = require('../common/auth')
const { setProfile } = require('./userPreloaders')
const {
  listUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser,
  updatePassword,
  listFollows,
  followUser,
  unfollowUser
} = require('./userControllers')

const users = express.Router()

// compare token username and parameter username and enforce to pass next middlewares just same ones
const authUser = (req, res, next) => {
  // means a valid access token issued
  // if token not provided automaticly pass the next middleware
  if (req.authenticated) {
    const { username: targetUsername } = req.params
    const { username: tokenUsername } = req.payload

    // user not same, unauthorized, returns 401
    if (targetUsername !== tokenUsername) return next(errors.userUnauthorized())
  }

  next()
}

users
  .route('/')
  .get(common.validators.pagination, listUsers)
  .post(validators.createUser, createUser)

users
  .route('/:username')
  .get(readUser)
  .patch(auth.required, authUser, validators.updateUser, updateUser)
  .delete(auth.required, authUser, deleteUser)

users
  .route('/:username/password')
  .post(auth.required, authUser, validators.updatePassword, updatePassword)

users
  .route('/:username/follows')
  .get(auth.optional, setProfile, listFollows)
  .post(auth.required, setProfile, followUser)
  .delete(auth.required, setProfile, unfollowUser)

module.exports = () => users
