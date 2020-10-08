const express = require('express')
const validators = require('./userValidators')
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

users
  .route('/')
  .get(common.validators.pagination, listUsers)
  .post(validators.createUser, createUser)

users
  .route('/:username')
  .get(readUser)
  .patch(auth.required, validators.updateUser, updateUser)
  .delete(auth.required, deleteUser)

users
  .route('/:username/password')
  .post(auth.required, validators.updatePassword, updatePassword)

users
  .route('/:username/follows')
  .get(auth.optional, setProfile, listFollows)
  .post(auth.required, setProfile, followUser)
  .delete(auth.required, setProfile, unfollowUser)

module.exports = () => users
