exports.apiOverview = async (req, res, next) => {
  res.status(200).json({ message: 'Navigate to /docs for documentation' })
}

exports.healthCheck = async (req, res, next) => {
  res.status(200).json({ message: 'ok' })
}
