import AppError from '../utils/appError.js';

export const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

export const sendErrorProd = (err, res) => {
  // Operational , trusted error send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programing or other unknown error: don't leak error details
  } else {
    // 1) Log Error
    console.error('ERROR 😒😒', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

export const handleDuplicateFieldDB = error => {
  const value = error.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field ${value}. Please use another value!`;
  return new AppError(message, 400);
};

export const handleValidationErrorDB = error => {
  const err = Object.values(error.errors).map(el => el.message);
  const message = `Invalid input data. ${err.join('. ')}`;
  return new AppError(message, 400);
};
