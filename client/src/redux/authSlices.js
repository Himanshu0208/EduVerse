import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast"

import axiosInstance from "../Helpers/axiosInstance.js"
const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') || false,
  role: localStorage.getItem("role") || "",
  data: localStorage.getItem("data") || {}
};

// function to handle signup
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    let res = axiosInstance.post("user/register", data);

    toast.promise(res, {
      loading: "Wait! Creating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: (err) => {
        if(err?.response?.data?.message) 
          return err?.response?.data?.message;
        return `Failed  to  register: ${err.message}`
      },
    });

    // getting response resolved here
    return (await res).data;
  } catch (error) {
    console.error(`Failed to register: ${error?.message}`);
  }
});

// function to handle login
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = axiosInstance.post("user/login", data);

    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: (err) => {
        if(err?.response?.data?.message)
          return err?.response?.data?.message
        return `Failed to login: ${err.message}`;
      },
    });

    // getting response resolved here
    return (await res).data;
  } catch (error) {
    console.error(`Failed to login: ${error?.message}`);
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    let res = axiosInstance.get("user/logout");

    toast.promise(res, {
      loading: "logging out",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to logout"
    });

    return (await res).data
  } catch (error) {
    toast.error(`Failed to logout: ${error?.response?.data?.message}`);
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // for register
      .addCase(createAccount.fulfilled, (state, action) => {
        console.log(action?.payload);
        if(action?.payload?.success) {
          localStorage.setItem("data", JSON.stringify(action?.payload?.data));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("role", action?.payload?.data?.role.toLowerCase());
          state.isLoggedIn = true;
          state.data = action?.payload?.data;
          state.role = action?.payload?.data?.role.toLowerCase();
        }
      })
      // for login
      .addCase(login.fulfilled, (state, action) => {
        if(action?.payload?.success) {
          localStorage.setItem("data", JSON.stringify(action?.payload?.data));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("role", action?.payload?.data?.role.toLowerCase());
          state.isLoggedIn = true;
          state.data = action?.payload?.data;
          state.role = action?.payload?.data?.role.toLowerCase();
        }
      })
      // for logout
      .addCase(logout.fulfilled, (state, action) => {
        if(action?.payload?.success) {
          localStorage.removeItem("data");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("role");
          state.isLoggedIn = false;
          state.data = undefined;
          state.role = undefined;
        }
      })
  }
});

// export const {} = authSlice.actions;
export default authSlice.reducer;