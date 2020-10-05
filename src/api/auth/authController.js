const User = require('mongoose').model('User');
const {AuthService} = require('../../services');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {RateLimiterMongo} = require('rate-limiter-flexible');
const requestIp = require('request-ip');
const to = require('await-to-js').default;
const errors = require('./authError');
const configs = require('../../configs');

const service = new AuthService();

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
      return next(errors.loginTooManyWrongAttemptsByIpAddress());
    }
  }

  // check if ip address already blocked for user
  if (!!resUsernameAndIP && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    // when api limit exceeded
    if (retrySecs > 0) {
      res.set('Retry-After', String(retrySecs));
      return next(errors.loginTooManyWrongAttemptsByUserAndIpAddress());
    }
  }

  User.findOne({username}, async (err, user) => {
    if (err) return next(err);
    if (user) {
      // validate password
      const isPasswordCorrect = await user.isPasswordCorrect(password);

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
          return next(errors.loginTooManyWrongAttemptsByUserAndIpAddress());
        }

        return next(errors.passwordIncorrect());
      }
    } else {
      // when user not found
      [err, limitStats] = await to(limiterSlowBruteByIP.consume(ipAddr));

      if (err) {
        const retrySecs = limiterSlowBruteByIP.blockDuration;
        res.set('Retry-After', String(retrySecs));
        return next(errors.loginTooManyWrongAttemptsByIpAddress());
      }

      return next(errors.userNotFound());
    }
  }).select('+password');
};

exports.logout = (req, res, next) => {
  // todo: add logic
};

exports.create_a_token = (req, res, next) => {
  const {username} = req;

  const accessTokenOptions = {expiresIn: configs.jwt.access_token_life};
  const refreshTokenOptions = {expiresIn: configs.jwt.refresh_token_life};

  // create a access token
  const accessToken = jwt.sign({username}, configs.secrets.jwt.access, accessTokenOptions);
  const refreshToken = jwt.sign({username}, configs.secrets.jwt.refresh, refreshTokenOptions);

  res.set('X-Access-Token', accessToken);
  res.set('X-Refresh-Token', refreshToken);
  res.end();
};

exports.activate_email = async (req, res, next) => {
  const {uid, token} = req.body;

  const isLinkValid = await service.validateActivationLink(uid, token);

  if (!isLinkValid) return next(errors.activationLinkNotValid());

  res.status(200).end();
};

exports.activate_email_resend = async (req, res, next) => {
  const {email} = req.body;

  const isResendSuccess = await service.resendActivationEmail(email);

  if (!isResendSuccess) return next(errors.resendEmailNotSuccess());

  res.status(200).end();
};
