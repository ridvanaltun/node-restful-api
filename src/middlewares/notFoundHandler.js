module.exports = (req, res, next) => {
  res.status(404).json({message: `${req.originalUrl} not found`});
};
