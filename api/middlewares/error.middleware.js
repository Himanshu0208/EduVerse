const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    status: err.statusCode
  })
}

export default errorMiddleware;