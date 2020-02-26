/**
 * Common validations
 */

const {celebrate, Joi, Segments} = require('celebrate');

// sort_order example: 'field -test', - (minus) meaning desc, otherwise asc
exports.pagination = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    select: Joi.string(),
    sort_order: Joi.string(),
  }),
});
