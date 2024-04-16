/* eslint-disable no-useless-escape */
import { useState } from "react";
import {toast} from "react-hot-toast"
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";

import login_image from "../assets/svg/login.svg"
import HomeLayout from "../layouts/HomeLayout";
import { login } from "../redux/slices/AuthSlices.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handelInputChange = (event) => {
    const {name, value} = event.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  }

  const handelFormSubmit = async (event) => {
    event.preventDefault();
    console.log(loginData);
    if(!loginData.email || !loginData.password ) {
      toast.error("Please Fill all the required feild");
      return;
    }

    if(
      !loginData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      toast.error("Please Enter a valid email");
      return;
    }

    if(!loginData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error("Password should be 8 characters long and contains UpperCase, LowerCase, Number and Symbol");
      return;
    }


    const formData = new FormData();
    formData.append("email", loginData.email);
    formData.append("password", loginData.password);
    const res = await dispatch(login(formData));

    if(res?.payload?.success) {
      navigate("/");
    }

    setLoginData({
      email: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[90vh]">
      <div className="w-1/2 h-[90vh] bg-[#FFEDB3] border border-black rounded-r-3xl">
        <img src={login_image} alt="login up image" className="h-full" />
      </div>

        <div className="w-1/2">
          <form onSubmit={handelFormSubmit} className="flex flex-col justify center gap-3 rounded-lg w-11/12 text-white">
            <h1 className="text-center text-2xl font-bold text-yellow-500">Login Page</h1>

            {/* input for email */}
            <div className="w-1/2 flex gap-5 mx-auto justify-between">
              <label htmlFor="role" className="py-1">Email: </label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                placeholder="Enter your Email" 
                className="w-7/12 px-3 py-1 border border-yellow-400  rounded-md" 
                value={loginData.email}
                onChange={handelInputChange}
              />
            </div>
            
            {/* input for password */}
            <div className="w-1/2 flex gap-5 mx-auto justify-between">
              <label htmlFor="role" className="py-1">Password: </label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder="Enter you password" 
                className="w-7/12 px-3 py-1 border border-yellow-400  rounded-md" 
                value={loginData.password}
                onChange={handelInputChange}
              />
            </div>
            
            {/* Submit Button and Reset Button */}
            <div className="flex justify-between w-1/2 mx-auto">
              <button 
                type="submit" 
                className="px-6 py-2 border border-yellow-500 bg-yellow-500 hover:bg-yellow-600 font-semibold rounded-md"
              >
                Submit
              </button>
              <button 
                type="reset" 
                className="px-6 py-2 border border-yellow-500 hover:bg-yellow-500 font-semibold rounded-md"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </HomeLayout>
  )
}