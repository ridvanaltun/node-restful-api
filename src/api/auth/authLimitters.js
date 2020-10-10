const mongoose = require('mongoose')
const { RateLimiterMongo } = require('rate-limiter-flexible')
const requestIp = require('request-ip')
const errors = require('./authErrors')

exports.login = async (req, res, next) => {
  const { username } = req.body

  const maxWrongAttemptsByIPperDay = 100
  const maxConsecutiveFailsByUsernameAndIP = 12

  const getUsernameIPkey = (username, ip) => `${username}_${ip}`

  // Kisaca 1 gunde 100 yanlis giris yaparsa IP adresini 1 gunlugune banla
  const limiterSlowBruteByIP = new RateLimiterMongo({
    storeClient: mongoose.connection,
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24 // Block for 1 day, if 100 wrong attempts per day
  })

  // Kisaca ard arda ayni kullaniciya 12 kez yanlis giris yaparsa IP adresini 1 saatligine banla
  const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
    storeClient: mongoose.connection,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
    blockDuration: 60 * 60 // Block for 1 hour
  })

  const ipAddr = requestIp.getClientIp(req)
  const usernameIpkey = getUsernameIPkey(username, ipAddr)

  // set limitters
  const resSlowByIP = await limiterSlowBruteByIP.get(ipAddr)
  const resUsernameAndIP = await limiterConsecutiveFailsByUsernameAndIP.get(usernameIpkey)

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

  req.limitters = {
    // SlowBruteByIpConsume
    limitSlowBruteByIpConsume: () => limiterSlowBruteByIP.consume(ipAddr),
    limitSlowBruteByIpBlockDuration: limiterSlowBruteByIP.blockDuration,
    // ConsecutiveFailsByUsernameAndIP
    resetConsecutiveFailsByUsernameAndIP: async () => {
      if (!!resUsernameAndIP && resUsernameAndIP.consumedPoints > 0) {
        await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIpkey)
      }
    },
    limiterConsecutiveFailsByUsernameAndIPConsume: () => limiterConsecutiveFailsByUsernameAndIP.consume(usernameIpkey),
    limiterConsecutiveFailsByUsernameAndIPBlockDuration: limiterConsecutiveFailsByUsernameAndIP.blockDuration
  }

  next()
}
