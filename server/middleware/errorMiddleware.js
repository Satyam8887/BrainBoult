// /middleware/errorMiddleware.js

// For routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);  // Pass to errorHandler
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // If status code wasn't set before, use 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    // Only show stack in development
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
