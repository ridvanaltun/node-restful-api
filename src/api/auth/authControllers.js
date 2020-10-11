const jwt = require('jsonwebtoken')
const to = require('await-to-js').default
const errors = require('./authErrors')
const configs = require('../../configs')

// services
const { AuthService, UserService } = require('../../services')
const AuthServiceInstance = new AuthService()
const UserServiceInstance = new UserService()

exports.login = async (req, res, next) => {
  const { username, password } = req.body

  const { success, data, error } = await AuthServiceInstance.login(username, password)

  if (error && error.message === 'Password incorrect') {
    // consume daily limit
    const [maxRetryDailyErr] = await to(req.limitters.limitSlowBruteByIpConsume())

    // max retry count exceed
    if (maxRetryDailyErr) {
      res.set('Retry-After', String(req.limitters.limitSlowBruteByIpBlockDuration))
      return next(errors.loginTooManyWrongAttemptsByIpAddress())
    }

    // consume limit of user
    const [maxRetryUserErr] = await to(req.limitters.limiterConsecutiveFailsByUsernameAndIPConsume())

    // max retry count exceed
    if (maxRetryUserErr) {
      res.set('Retry-After', String(req.limitters.limiterConsecutiveFailsByUsernameAndIPBlockDuration))
      return next(errors.loginTooManyWrongAttemptsByUserAndIpAddress())
    }

    return next(errors.passwordIncorrect())
  }

  if (!success) return next(error)

  // reset username+ip based api limit on successful authorisation
  req.limitters.resetConsecutiveFailsByUsernameAndIP()

  res.json(data)
}

exports.logout = async (req, res, next) => {
  const { refresh_token: refreshToken } = req.body

  // not allow jwt without exp
  const ok = await req.blacklist.add(refreshToken)

  if (!ok) return next(errors.refreshTokenMalformed())

  res.status(204).end()
}

exports.createToken = async (req, res, next) => {
  const { refresh_token: refreshToken } = req.body

  // blacklist control
  const isRevoked = await req.blacklist.has(refreshToken)

  // refresh token revoked
  if (isRevoked) return next(errors.refreshTokenRevoked())

  // verify refresh token
  jwt.verify(refreshToken, configs.secrets.jwt.refresh, (err, decoded) => {
    if (err) return next(err)

    const { id, role } = decoded

    const accessTokenOptions = { expiresIn: configs.jwt.accessTokenLife }
    const refreshTokenOptions = { expiresIn: configs.jwt.refreshTokenLife }

    // create a access token
    const accessToken = jwt.sign({ id, role }, configs.secrets.jwt.access, accessTokenOptions)
    const refreshToken = jwt.sign({ id, role }, configs.secrets.jwt.refresh, refreshTokenOptions)

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  })
}

exports.revokeToken = async (req, res, next) => {
  const { token: refreshToken } = req.params

  // not allow jwt without exp
  const ok = await req.blacklist.add(refreshToken)

  if (!ok) return next(errors.refreshTokenMalformed())

  res.status(204).end()
}

exports.activateEmail = async (req, res, next) => {
  const { uid, token } = req.body

  const { success, error } = await AuthServiceInstance.validateMailActivationCode(uid, token)

  if (!success) return next(error)

  res.end()
}

exports.activateEmailResend = async (req, res, next) => {
  const { email } = req.body

  const { success, error } = await AuthServiceInstance.resendActivationMail(email)

  if (!success) return next(error)

  res.end()
}

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body

  const { success, error } = await AuthServiceInstance.sendResetPasswordMail(email)

  if (!success) return next(error)

  res.end()
}

exports.resetPassword = async (req, res, next) => {
  const { uid, token, password, new_password: newPassword } = req.body

  const { success: isLinkValid, error: linkError } = await AuthServiceInstance.validateResetPasswordActivationCode(uid, token)

  if (!isLinkValid) return next(linkError)

  const { success: isUserValid, data: user, error: userError } = await UserServiceInstance.getById(uid)

  if (!isUserValid) return next(userError)

  const { success, error } = await UserServiceInstance.changePassword(user.username, password, newPassword)

  if (!success) return next(error)

  res.end()
}
