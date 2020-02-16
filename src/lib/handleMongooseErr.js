module.exports = (err, res) => {
  if (err && err.name === 'MongoError') {
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
  }
};
