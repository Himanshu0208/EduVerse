import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.middleware.js";


// Middleware to check if user is logged in or not
export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const {token} = req.cookies;
  if(!token) {
    return next(new AppError("Unauthenticated, Login again", 400));
  }

  const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = userDetails;
  console.log(req.body);
  next(); 
})

// Middleware to check if user is admin or not
export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to view this route", 403)
      );
    }

    next();
  });

// Middleware to check if user has an active subscription or not
export const authorizeSubscribers = asyncHandler(async (req, _res, next) => {
  // If user is not admin or does not have an active subscription then error else pass
  if (req.user.role !== "ADMIN" && req.user.subscription.status !== "active") {
    return next(new AppError("Please subscribe to access this route.", 403));
  }

  next();
})