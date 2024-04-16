import { configureStore } from "@reduxjs/toolkit"

import authSliceReducer from "./slices/AuthSlices.js";

const store = configureStore({
  reducer: {
    user: authSliceReducer
  },
  devTools: true
})

export default store;