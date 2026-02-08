exports.errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors || {}).map((v) => v.message).join(', ') || message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};
