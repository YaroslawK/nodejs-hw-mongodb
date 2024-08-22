const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message || 'Internal Server Error',
    data: err.data,
  });
};

export default errorHandler;
