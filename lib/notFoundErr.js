// 404
module.exports = () => (req, res, next) => {
  res.status(404);
  res.send({ url: `${req.originalUrl} not found` });
};
