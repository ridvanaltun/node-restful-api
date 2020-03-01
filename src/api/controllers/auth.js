const User = require('mongoose').model('User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {RateLimiterMongo} = require('rate-limiter-flexible');
const requestIp = require('request-ip');
const to = require('await-to-js').default;
const ex = require('../../exceptions');
const config = require('../../config');
const {password: pw} = require('../../lib');

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 12;

const limiterSlowBruteByIP = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

exports.login = async (req, res, next) => {
  const {access, refresh} = req.token;
  const {username, password} = req.body;

  const ipAddr = requestIp.getClientIp(req);
  const usernameIPkey = getUsernameIPkey(username, ipAddr);

  // set limitters
  const resSlowByIP = await limiterSlowBruteByIP.get(ipAddr);
  const resUsernameAndIP = await limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey);

  // check if ip address already blocked
  if (!!resSlowByIP && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    // when api limit exceeded
    if (retrySecs > 0) {
      res.set('Retry-After', String(retrySecs));
      return next(new ex.TooManyRequestError('Too many wrong login attempts by this ip address'));
    }
  }

  // check if ip address already blocked for user
  if (!!resUsernameAndIP && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    // when api limit exceeded
    if (retrySecs > 0) {
      res.set('Retry-After', String(retrySecs));
      return next(new ex.TooManyRequestError('Too many wrong password provided to the user by this ip address'));
    }
  }

  User.findOne({username}, async (err, user) => {
    if (err) return next(err);
    if (user) {
      // validate password
      const isPasswordCorrect = await pw.validatePassword(password, user.password);

      // hide password after validation
      user.password = undefined;

      if (isPasswordCorrect) {
        // reset username+ip based api limit on successful authorisation
        if (!!resUsernameAndIP && resUsernameAndIP.consumedPoints > 0) {
          await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
        }
        // give tokens
        res.set('X-Access-Token', access);
        res.set('X-Refresh-Token', refresh);
        res.json(user);
      } else {
        // when password wrong
        [err, limitStats] = await to(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));

        if (err) {
          const retrySecs = limiterConsecutiveFailsByUsernameAndIP.blockDuration;
          res.set('Retry-After', String(retrySecs));
          return next(new ex.TooManyRequestError('Too many wrong password provided to the user by this ip address'));
        }

        return next(new ex.BadRequestError('Password incorrect'));
      }
    } else {
      // when user not found
      [err, limitStats] = await to(limiterSlowBruteByIP.consume(ipAddr));

      if (err) {
        const retrySecs = limiterSlowBruteByIP.blockDuration;
        res.set('Retry-After', String(retrySecs));
        return next(new ex.TooManyRequestError('Too many wrong login attempts by this ip address'));
      }

      return next(new ex.NotFoundError('User not found'));
    }
  }).select('+password');
};

exports.logout = (req, res, next) => {
  // TODO: ADD LOGIC
};

exports.create_a_token = (req, res, next) => {
  const {username} = req;

  const accessTokenOptions = {expiresIn: config.jwt.access_token_life};
  const refreshTokenOptions = {expiresIn: config.jwt.refresh_token_life};

  // create a access token
  const accessToken = jwt.sign({username}, config.secrets.jwt.access, accessTokenOptions);
  const refreshToken = jwt.sign({username}, config.secrets.jwt.refresh, refreshTokenOptions);

  res.set('X-Access-Token', accessToken);
  res.set('X-Refresh-Token', refreshToken);
  res.end();
};
