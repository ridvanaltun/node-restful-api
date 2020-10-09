// Log errors to console
module.exports = (err, req, res, next) => {
  console.log('############################# START ERROR #############################')
  console.error(err.stack)
  console.log('############################## END ERROR ##############################')

  next(err)
}
