import AppError from "../utils/error.util.js";

export const canCreate = async (req, res, next) => {
  try {
    if(req.user.role !== 'teacher' && req.user.role !== 'organisation') {
      return next(new AppError("Unauthorized, to create course", 400));
    }
    console.log(req.body);
    next();
  } catch (error) {
    return next(new AppError(`can create course validation failed ${error.message}`));
  }
}