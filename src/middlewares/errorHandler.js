const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    status: err.status,
    message: 'Something went wrong',
    data: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
