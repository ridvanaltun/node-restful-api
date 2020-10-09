const { dev: devMode } = require('../configs').app

// Server error handler
module.exports = (err, req, res, next) => {
  res.status(err.status || 500)
  if (devMode) res.json({ error: err })
  res.end()
}
