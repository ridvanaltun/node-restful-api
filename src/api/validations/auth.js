const {celebrate, Joi, Segments} = require('celebrate');

const login = celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
  }),
});

const logout = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
});

const token = celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    'x-refresh-token': Joi.string().required(),
  }).unknown(),
});

module.exports = {
  login,
  logout,
  token,
};
