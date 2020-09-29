module.exports = (req, res, next) => {
  res.status(404);
  res.send({error: `${req.originalUrl} not found`});
};
