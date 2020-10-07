const express = require('express')
const validators = require('./userValidators')
const params = require('./userParams')
const common = require('../common')
const auth = require('../common/auth')
const {
  listUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser,
  updatePassword,
  followUser,
  unfollowUser
} = require('./userControllers')

const users = express.Router()

// todo: routers i router, controllers i controller, validators i validator olarak cevirebilirim
// todo: controller on ekini kaldir sadece fonksiyon adini kullan
// todo: follows kismina get istegi getir, kullaniciyi follow eden profiller listelensin

// preload user profile on routes with ':username' to req.profile
// todo: bunu bu sayfa icinde bir middleware haline getir, adi: setProfile olsun
// todo: yukarida taski yapinca params kullanmaya gerek kalmiyor, silinebilir.
users.param('username', params.username)

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
  .post(auth.required, followUser)
  .delete(auth.required, unfollowUser)

module.exports = () => users
