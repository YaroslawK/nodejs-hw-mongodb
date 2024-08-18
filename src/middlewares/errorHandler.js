const errorHandler = (err, req, res, next) => {
  res.status(err.status).json({
    status: err.status,
    message: 'Something went wrong',
    data: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
