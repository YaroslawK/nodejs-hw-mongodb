import createHTTPError from 'http-errors';

const notFoundHandler = (req, res, next) => {
  next(createHTTPError(404, 'Route not found'));
};

export default notFoundHandler;
