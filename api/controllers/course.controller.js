import AppError from "../utils/error.util.js";
import Course from "../models/course.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
/**
 * @ROUTE @POST {{URL}}/
 * @ACCESS Private (teacher or organisation)
 */
export const createCourse = asyncHandler(async (req, res, next) => {
  const {email} = req.user;
  const { 
    title, 
    overview, 
    description, 
    preRequisites, 
    learnings, 
    thumbnail, 
    video
  } = req.body;

  console.log(
    email, 
    title, 
    overview, 
    description, 
    preRequisites, 
    learnings, 
    thumbnail, 
    video);
    
  if(!email || !title || !overview || !description || !preRequisites || !learnings || !thumbnail || !video) {
    return next(new AppError("All feilds are required", 400));
  }

  const course = new Course({
    email,
    title,
    overview,
    description,
    preRequisites,
    learnings,
    thumbnail,
    video
  })

  await course.save();
  res.status(201).json({
    success: true,
    message: "Course Created Successfully",
    course: course
  })
});

/**
 * @ROUTE @GET {{URL}}/
 * @ACCESS Public
 */
export const getAllCourse = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({}).select('-lectures');
  res.status(201).json({
    success: true,
    message: "All courses",
    courses: courses
  })
});

/**
 * @ROUTE @DELETED {{URL}}/
 * @ACCESS Public
 */
export const removeLectureFromCourse = asyncHandler(async(req, res, next) => {
  const {courseId, lectureId} = req.body;

  // Checking if both courseId and lectureId are present
  if(!courseId) {
    return next(AppError("Course Id is required", 400));
  }
  if(!lectureId) {
    return next(AppError("Lecture Id is required", 400));
  }

  // Find the course uding the courseId
  const course = await Course.findById(courseId);
  // If no course send custom message
  if(!course) {
    return next(AppError("Invalid course id", 400));
  }

  // Find the index of the lecture using the lectureId
  const lectureIndex = course.lectures.findIndex(
    (lecture) => lecture._id.toString() === lectureId
  );

  // If returned index is -1 then send error as mentioned below
  if (lectureIndex === -1) {
    return next(new AppError('Lecture does not exist.', 404));
  }

  // Remove the lecture from the array
  course.lectures.splice(lectureIndex, 1);

  // update the number of lectures based on lectres array length
  course.numberOfLectures = course.lectures.length;

  // Save the course object
  await course.save();

  // Return response
  res.status(200).json({
    success: true,
    message: 'Course lecture removed successfully',
  });
})


/**
 * @GET_LECTURES_BY_COURSE_ID
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS Private(ADMIN, subscribed users only)
 */
export const getLecturesByCourseId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError('Invalid course id or course not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Course lectures fetched successfully',
    lectures: course.lectures,
  });
});
