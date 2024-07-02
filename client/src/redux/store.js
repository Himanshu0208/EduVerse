import { configureStore } from "@reduxjs/toolkit"

import authSliceReducer from "./authSlices.js";
import courseSliceReducer from "./courseSlices.js";

const store = configureStore({
  reducer: {
    user: authSliceReducer,
    course: courseSliceReducer
  },
  devTools: true
})

export default store;