const User = require('mongoose').model('User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { RateLimiterMongo } = require('rate-limiter-flexible')
const requestIp = require('request-ip')
const to = require('await-to-js').default
const errors = require('./authErrors')
const configs = require('../../configs')

// services
const { AuthService } = require('../../services')
const AuthServiceInstance = new AuthService()

const maxWrongAttemptsByIPperDay = 100
const maxConsecutiveFailsByUsernameAndIP = 12

const limiterSlowBruteByIP = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24 // Block for 1 day, if 100 wrong attempts per day
})

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
  storeClient: mongoose.connection,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60 // Block for 1 hour
})

const getUsernameIPkey = (username, ip) => `${username}_${ip}`

exports.login = async (req, res, next) => {
  const { username, password } = req.body

  const ipAddr = requestIp.getClientIp(req)
  const usernameIPkey = getUsernameIPkey(username, ipAddr)

  // set limitters
  const resSlowByIP = await limiterSlowBruteByIP.get(ipAddr)
  const resUsernameAndIP = await limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey)

  // check if ip address already blocked
  if (!!resSlowByIP && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    const retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1
    // when api limit exceeded
    if (retrySecs > 0) {
      res.set('Retry-After', String(retrySecs))
      return next(errors.loginTooManyWrongAttemptsByIpAddress())
    }
  }

  // check if ip address already blocked for user
  if (!!resUsernameAndIP && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    const retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1
    // when api limit exceeded
    if (retrySecs > 0) {
      res.set('Retry-After', String(retrySecs))
      return next(errors.loginTooManyWrongAttemptsByUserAndIpAddress())
    }
  }

  // find user
  const user = await User.findOne({ username })

  // when user not found
  if (!user) {
    const [err] = await to(limiterSlowBruteByIP.consume(ipAddr))

    if (err) {
      const retrySecs = limiterSlowBruteByIP.blockDuration
      res.set('Retry-After', String(retrySecs))
      return next(errors.loginTooManyWrongAttemptsByIpAddress())
    }

    return next(errors.userNotFound())
  }

  // validate password
  const isPasswordCorrect = await user.isPasswordCorrect(password)

  if (isPasswordCorrect) {
    // reset username+ip based api limit on successful authorisation
    if (!!resUsernameAndIP && resUsernameAndIP.consumedPoints > 0) {
      await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey)
    }

    const { access, refresh } = user.generateJWT()

    // give tokens
    res.set('X-Access-Token', access)
    res.set('X-Refresh-Token', refresh)

    res.json(user.toProfileJSON())
  } else {
    // when password wrong
    const [err] = await to(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey))

    if (err) {
      const retrySecs = limiterConsecutiveFailsByUsernameAndIP.blockDuration
      res.set('Retry-After', String(retrySecs))
      return next(errors.loginTooManyWrongAttemptsByUserAndIpAddress())
    }

    return next(errors.passwordIncorrect())
  }
}

exports.logout = async (req, res, next) => {
  const { refresh_token: refreshToken } = req.body

  // not allow jwt without exp
  const ok = await req.blacklist.add(refreshToken)

  if (!ok) return next(errors.accessTokenMalformed())

  res.status(204).end()
}

// todo: add blacklist control
exports.createToken = async (req, res, next) => {
  const token = req.headers['x-refresh-token']

  // blacklist control
  const isRevoked = await req.blacklist.has(token)

  // refresh token revoked
  if (isRevoked) return next(errors.refreshTokenRevoked())

  // verify refresh token
  jwt.verify(token, configs.secrets.jwt.refresh, (err, decoded) => {
    if (err) return next(err)

    const { id, role } = decoded

    const accessTokenOptions = { expiresIn: configs.jwt.accessTokenLife }
    const refreshTokenOptions = { expiresIn: configs.jwt.refreshTokenLife }

    // create a access token
    const accessToken = jwt.sign({ id, role }, configs.secrets.jwt.access, accessTokenOptions)
    const refreshToken = jwt.sign({ id, role }, configs.secrets.jwt.refresh, refreshTokenOptions)

    res.set('X-Access-Token', accessToken)
    res.set('X-Refresh-Token', refreshToken)
    res.end()
  })
}

exports.activateEmail = async (req, res, next) => {
  const { uid, token } = req.body

  const { success, error } = await AuthServiceInstance.validateActivationMailLink(uid, token)

  if (!success) return next(error)

  res.end()
}

exports.activateEmailResend = async (req, res, next) => {
  const { email } = req.body

  const { success, error } = await AuthServiceInstance.resendActivationMail(email)

  if (!success) return next(error)

  res.end()
}
