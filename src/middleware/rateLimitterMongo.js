const mongoose = require('mongoose');
const {RateLimiterMongo} = require('rate-limiter-flexible');
const requestIp = require('request-ip');
const ex = require('../exceptions');

const mongoConn = mongoose.connection;

module.exports = (options) => {
  return function(req, res, next) {
    const limitterOptions = {...options, storeClient: mongoConn};

    const rateLimiter = new RateLimiterMongo(limitterOptions);
    const ip = requestIp.getClientIp(req);

    rateLimiter.consume(ip)
        .then(() => {
          next();
        })
        .catch(() => {
          next(new ex.TooManyRequestError('You exceeded the api limit'));
        });
  };
};
