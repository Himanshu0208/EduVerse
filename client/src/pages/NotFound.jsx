
import {useNavigate} from "react-router-dom"

import not_found from "../assets/svg/page-not-found.svg"
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div className="h-[100vh] w-[100vw]">
        <div className="h-[80vh] w-[80vw] mx-auto mt-[10vh] flex items-center justify-center bg-[#FFFFF0] border rounded-lg">
          <div className="w-1/2 items-start">
            <h1 className="text-5xl font-bold text-gray-700 flex flex-col gap-3 px-10">
              Ooops... 
              <span className="text-3xl font-normal">Page Not Found</span>
            </h1>
            <p className="text-gray-700 px-10 mt-5">The page you are looking for doesn&apos;t exists or an other error occured, go back to home page</p>
            <div className="ml-10 mt-10 space-x-6">
              <button onClick={() => navigate(-1)} className="px-10 py-2 rounded-md text-white font-semibold bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-200 cursor-pointer">
                Go Back
              </button>
              <button onClick={() => navigate("/")} className="border border-yellow-400 px-10 py-2 rounded-md font-semibold cursor-pointer
              text-gray-700 hover:text-white hover:bg-yellow-500 transition-all ease-in-out duration-200">
                Go Home
              </button>
            </div>
          </div>
          <img src={not_found} alt="not found" className="h-[80%] w-1/2"/>
        </div>
      </div>
    </>
  )
}