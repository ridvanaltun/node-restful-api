// Handle client errors
module.exports = (err, req, res, next) => {
  // Handle mongoose errors
  if (err.name === 'MongoError') return handleMongooseErrors(err, res);

  // Pass error to server error handler
  next(err);
};

const handleMongooseErrors = (err, res) =>{
  switch (err.code) {
    case 11000: // handle duplicate key error
      res.status(409);
      res.send({ status: 409, error_code: err.code, error: err.errmsg });
      break;
    default:
      res.status(418);
      res.send({ code: err.code, error: err.errmsg });
      break;
  }
};
