const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || []
  });
};

module.exports = errorHandler;
