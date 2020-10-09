module.exports = (key, item) => {
  return (req, res, next) => {
    req[key] = item
    next()
  }
}
