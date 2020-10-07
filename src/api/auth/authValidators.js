const { celebrate, Joi, Segments } = require('celebrate')

exports.login = celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
      .required()
  })
})

exports.logout = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
})

exports.createToken = celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    'x-refresh-token': Joi.string().required()
  }).unknown()
})

exports.activateEmail = celebrate({
  [Segments.BODY]: Joi.object().keys({
    uid: Joi.string().required(),
    token: Joi.string().required()
  })
})

exports.activateEmailResend = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required()
  })
})
