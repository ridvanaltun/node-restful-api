exports.sendError = (error) => {
  return {success: false, error: error};
};

exports.sendSuccess = (body) => {
  return {success: true, data: body};
};
