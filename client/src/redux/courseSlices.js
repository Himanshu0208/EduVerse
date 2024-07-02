import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {toast} from 'react-hot-toast'

import axiosInstance from "../Helpers/axiosInstance";

const initialState = {
  courseData: [],
}

// function to get all courses
export const getAllCourse = createAsyncThunk("/course/get", async() => {
  try {
    const res = axiosInstance.get("/courses");

    toast.promise(res, {
      loading: "Loading Course Data",
      success: "Course loaded successfully",
      error: "Failed to get course",
    })

    const response = await res;

    return response.data.course;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
})

// function to create course
export const createCourse = createAsyncThunk("/course/create", async (courseData) => {
  try {
    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("overview", courseData.overview);
    formData.append("description", courseData.description);
    formData.append("preRequisites", courseData.preRequisites);
    formData.append("learnings", courseData.learning);
    formData.append("thumbnail", courseData.thumbnail);
    formData.append("video", courseData.introVideo);

    console.log(formData);
    const res = axiosInstance.post("/course", formData);

    toast.promise(res, {
      loading: "Create the course",
      success: "Course create successfully",
      error: "Failed to create course"
    })
    
    const response = await res;
    return response.data;
    
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
})

// function to delete the course
export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
  try {
    const res = axiosInstance.delete(`courses/${id}`);

    toast.promise(res, {
      loading: "Deleting the course...",
      success: "Courses deleted successfully",
      error: "Failed to delete course",
    });

    const response = await res;

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


// function to update course
export const updateCourse = createAsyncThunk("/course/create", async (courseData) => {
  try {
    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("overview", courseData.overview);
    formData.append("description", courseData.description);
    formData.append("preRequisites", courseData.preRequisites);
    formData.append("learning", courseData.learning);
    formData.append("thumbnail", courseData.imageURL);
    formData.append("video", courseData.videoURL);

    const res = axiosInstance.put(`/course/${courseData.id}`, formData);

    toast.promise(res, {
      loading: "Updating the course",
      success: "Course updated successfully",
      error: "Failed to update course"
    })
    
    const response = await res;
    return response.data;
    
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
})


const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCourse.fulfilled, (state, action) => {
      if(action.payload) {
        state.courseData = [...action.payload];
      }
    })
  }
})

// export const {} = courseSlice.actions;
export default courseSlice.reducer;
