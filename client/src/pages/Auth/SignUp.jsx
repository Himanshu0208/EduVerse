/* eslint-disable no-useless-escape */
import { useRef, useState } from "react";
import {toast} from "react-hot-toast"
import { BsPersonCircle } from "react-icons/bs";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";

import signup from "../../Assets/svg/signup.svg"
import HomeLayout from "../../Layouts/HomeLayout";
import { createAccount } from "../../Redux/authSlices";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("");
  const [signupData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: "",
  });

  const handelInputChange = (event) => {
    const {name, value} = event.target;
    setSignUpData({
      ...signupData,
      [name]: value
    });
  }

  const getImage = (event) => {
    event.preventDefault();

    const uploadedImage = event.target.files[0];

    if(uploadedImage) {
      setSignUpData({...signupData, avatar: uploadedImage})
      const file = new FileReader();
      file.readAsDataURL(uploadedImage);
      file.addEventListener("load", function (){
        setPreviewImage(this.result);
      })
    }
  }

  const handelFormSubmit = async (event) => {
    event.preventDefault();
    console.log(signupData);
    if(
      !signupData.fullName ||
      !signupData.email ||
      !signupData.password ||
      !signupData.role
    ) {
      toast.error("Please Fill all the required feild");
      return;
    }

    if(signupData.fullName.length < 3) {
      toast.error("Name should be of atleast 3 characters");
    }

    if(
      !signupData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      toast.error("Please enter correct rmail address");
      return;
    }

    if(!signupData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error("Password should be 8 characters long and contains UpperCase, LowerCase, Number and Symbol");
      return;
    }

    if(
      !(signupData.role === 'STUDENT' || 
      signupData.role === 'TEACHER' || 
      signupData.role === 'ORGANISATION')
    ) {
      toast.error("Please select a role");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);
    formData.append("role", signupData.role);

    const res = await dispatch(createAccount(formData));

    if(res?.payload?.success) {
      navigate("/");
    }

    setSignUpData({
      fullName: "",
      email: "",
      password: "",
      avatar: "",
      role: ""
    });
    setPreviewImage("");
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[90vh]">
      <div className="w-1/2 h-[90vh] bg-[#FFEDB3] border border-black rounded-r-3xl">
        <img src={signup} alt="sign up image" className="h-full"/>
      </div>

        <div className="w-1/2">
          <form onSubmit={handelFormSubmit} className="flex flex-col justify center gap-3 rounded-lg w-11/12 text-white">
            <h1 className="text-center text-2xl font-bold text-yellow-500">Registration Page</h1>
            
            {/* input for avatar */}
            {previewImage ? (
              <img 
                src={previewImage} 
                onClick={() => avatarRef.current.click()} 
                className="w-24 h-24 rounded-full mx-auto mt-10"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full mx-auto mt-10" onClick={() => avatarRef.current.click()}/>
            )}
            <input 
              type="file" 
              name="avatar" 
              id="avatar" 
              accept=".jpg,.jpeg,.png" 
              className="hidden" 
              ref={avatarRef} 
              onChange={getImage}
            />

            {/* input for fullName */}
            <div className="w-1/2 flex gap-5 mx-auto justify-between">
              <label htmlFor="role" className="py-1">Full Name: </label>
              <input 
                type="text" 
                name="fullName" 
                id="fullName" 
                placeholder="Enter your name" 
                className="w-7/12 px-3 py-1 border border-yellow-400  rounded-md" 
                value={signupData.fullName}
                onChange={handelInputChange}
              />
            </div>

            {/* input for email */}
            <div className="w-1/2 flex gap-5 mx-auto justify-between">
              <label htmlFor="role" className="py-1">Email: </label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                placeholder="Enter your Email" 
                className="w-7/12 px-3 py-1 border border-yellow-400  rounded-md" 
                value={signupData.email}
                onChange={handelInputChange}
              />
            </div>

            {/* input for role */}
            <div className="w-1/2 flex gap-5 mx-auto justify-between">
              <label htmlFor="role" className="py-1">Who are you: </label>
              <select 
                id="role" 
                name="role" 
                className="w-7/12 px-3 py-1 border border-yellow-500 rounded-md" 
                value={signupData.role}
                onChange={handelInputChange}
              >
                <option value="no value">Choose</option>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ORGANISATION">Organization</option>
              </select>
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
                value={signupData.password}
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