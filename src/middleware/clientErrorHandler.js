// Handle client errors
module.exports = (err, req, res, next) => {
  // Handle mongoose errors
  if (err.name === 'MongoError') return handleMongooseErrors(err, res);

  // Handle jwt errors
  const jwtErrors = ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'];
  if (jwtErrors.includes(err.name)) return handleJwtErrors(err, res);

  // Handle bad request errors
  if (err.name === 'BadRequestError') return handleBadRequestError(err, res);

  // Handle unauthorized errors
  if (err.name === 'UnauthorizedError') return handleUnauthorizedError(err, res);

  // Handle not found errors
  if (err.name === 'NotFoundError') return handleNotFoundError(err, res);

  // Handle not found errors
  if (err.name === 'TooManyRequestError') return handleTooManyRequestError(err, res);

  // Pass error to server error handler
  next(err);
};

const handleMongooseErrors = (err, res) => {
  switch (err.code) {
    case 11000: // handle duplicate key error
      res.status(409);
      res.send({status: 409, error_code: err.code, error: err.errmsg});
      break;
    default:
      res.status(418);
      res.send({code: err.code, error: err.errmsg});
      break;
  }
};

const handleJwtErrors = (err, res) => {
  switch (err.name) {
    case 'TokenExpiredError':
      res.status(401);
      res.send({code: 401, title: 'Unauthorized', message: 'Token expired'});
      break;
    case 'JsonWebTokenError':
      res.status(400);
      res.send({code: 400, title: 'Bad Request', message: 'Token malformed'});
      break;
    case 'NotBeforeError':
      res.status(400);
      res.send({code: 400, title: 'Bad Request', message: 'Token not active'});
      break;
  }
};

const handleBadRequestError = (err, res) => {
  res.status(400);
  res.send({code: 400, title: 'Bad Request', message: err.message});
};

const handleUnauthorizedError = (err, res) => {
  res.status(401);
  res.send({code: 401, title: 'Unauthorized', message: err.message});
};

const handleNotFoundError = (err, res) => {
  res.status(404);
  res.send({code: 404, title: 'Not Found', message: err.message});
};

const handleTooManyRequestError = (err, res) => {
  res.status(429);
  res.send({code: 429, title: 'Too Many Request', message: err.message});
};

