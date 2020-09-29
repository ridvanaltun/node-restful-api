const {celebrate, Joi, Segments} = require('celebrate');

exports.create_a_user = celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
  }),
});


exports.update_a_user = celebrate({
  [Segments.BODY]: Joi.object().keys({
    first_name: Joi.string(),
    last_name: Joi.string(),
  }),
});


exports.update_password = celebrate({
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    new_password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
  }),
});
