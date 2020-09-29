// Handle client errors
module.exports = (err, req, res, next) => {
  // Handle mongoose errors
  if (err.name === 'MongoError') return handleMongooseErrors(err, res);

  // Handle jwt errors
  const jwtErrors = ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'];
  if (jwtErrors.includes(err.name)) return handleJwtErrors(err, res);

  // Handle http errors
  if (err.status) return res.status(err.status).send({...err});

  // Pass error to server error handler
  next(err);
};

const handleMongooseErrors = (err, res) => {
  switch (err.code) {
    case 11000: // handle duplicate key error
      res.status(409).send({code: err.code, error: err.errmsg});
      break;
    default:
      res.status(418).send({code: err.code, error: err.errmsg});
      break;
  }
};

const handleJwtErrors = (err, res) => {
  switch (err.name) {
    case 'TokenExpiredError':
      res.status(401).send({message: 'Token expired'});
      break;
    case 'JsonWebTokenError':
      res.status(400).send({message: 'Token malformed'});
      break;
    case 'NotBeforeError':
      res.status(400).send({message: 'Token not active'});
      break;
  }
};
