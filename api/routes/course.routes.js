import { Router } from "express";
import { canCreate } from "../middlewares/course.middleware.js";
import {
  createCourse, 
  getAllCourse,
  removeLectureFromCourse
} from "../controllers/course.controller.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllCourse)
  .post(isLoggedIn, canCreate, upload.none(), createCourse)
  .delete(isLoggedIn, authorizeRoles(['TEACHER', 'ORGANIZATION']), removeLectureFromCourse)

// router
//   .route('/:id')
//   .get(isLoggedIn, authorizeSubscribers, getLecturesByCourseId) // Added authorizeSubscribers to check if user is admin or subscribed if not then forbid the access to the lectures
//   .post(
//     isLoggedIn,
//     authorizeRoles('ADMIN'),
//     upload.single('lecture'),
//     addLectureToCourseById
//   )
//   .put(isLoggedIn, authorizeRoles('ADMIN'), updateCourseById);

export default router;
