const createError = require('http-errors');

exports.requestLogNotFound = () => createError.NotFound('Request log not found');
