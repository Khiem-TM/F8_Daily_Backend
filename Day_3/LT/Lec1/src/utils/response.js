const successResponse = (res, data, message = "Success") => {
  return res.status(200).json({
    message,
    data,
  });
};

const errorResponse = (res, message = "Error") => {
  return res.status(500).json({
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
