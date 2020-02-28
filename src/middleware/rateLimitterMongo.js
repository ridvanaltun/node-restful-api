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
        .catch((rlRes) => {
          const duration = Math.round(options.duration) || 1;
          const points = options.points;
          const retrySecs = Math.round(rlRes.msBeforeNext / 1000) || 1;

          message = retrySecs === 1 ?
          `You exceeded the api limit, retry after ${retrySecs} sec,` :
          `You exceeded the api limit, retry after ${retrySecs} secs,`;
          message += duration === 1 ?
          ` this endpoint allows you ${points} request in ${duration} sec.` :
          ` this endpoint allows you ${points} request in ${duration} secs.`;

          res.set('Retry-After', String(retrySecs));

          next(new ex.TooManyRequestError(message));
        });
  };
};
