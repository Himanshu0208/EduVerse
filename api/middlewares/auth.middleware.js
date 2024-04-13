import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken"
export const isLoggedIn = async (req, res, next) => {
  try {
    const {token} = req.cookies;
    if(!token) {
      return next(new AppError("Unauthenticated, Login again", 400));
    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;
    next(); 
  } catch (error) {
    return next(new AppError(`Login validation failed: ${error.message}`))
  }
}