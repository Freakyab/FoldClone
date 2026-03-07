const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';

  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    errorCode = 'VALIDATION_ERROR';
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    errorCode = 'DUPLICATE_KEY';
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field ? field : 'Field'} already exists`;
  }

  if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST;
    errorCode = 'INVALID_ID';
    message = `Invalid value for field: ${err.path}`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    errorCode = 'INVALID_TOKEN';
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Token has expired';
  }

  const response = {
    success: false,
    message,
    errorCode,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
