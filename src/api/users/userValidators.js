const {celebrate, Joi, Segments} = require('celebrate');

exports.createUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().min(6).max(30).regex(/^[a-zA-Z0-9]+$/).required().label('Username'),
    password: Joi.string().min(8).max(30).required().label('Password'),
    email: Joi.string().email().required().label('Email'),
    first_name: Joi.string().regex(/^[a-zA-Z]+$/).required().label('First Name'),
    last_name: Joi.string().regex(/^[a-zA-Z]+$/).required().label('Last Name'),
  }),
});


exports.updateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    first_name: Joi.string().regex(/^[a-zA-Z]+$/).label('First Name'),
    last_name: Joi.string().regex(/^[a-zA-Z]+$/).label('Last Name'),
  }),
});


exports.updatePassword = celebrate({
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().min(8).max(30).required().label('Password'),
    new_password: Joi.string().min(8).max(30).required().label('New Password'),
  }),
});
