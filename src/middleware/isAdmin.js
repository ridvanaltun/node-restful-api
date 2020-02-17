module.exports = (req, res, next) => {
  // TODO: ADD LOGIC
  const IS_ADMIN = true;
  if (IS_ADMIN) {
    next();
  } else {
    res.status(401);
    res.send({code: 401, error: 'Unauthorized'});
  }
};
