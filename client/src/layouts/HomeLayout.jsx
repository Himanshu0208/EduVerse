import {toast} from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector} from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../Components/Footer";
import { logout } from "../Redux/authSlices";
export default function HomeLayout({children}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state?.user?.isLoggedIn);
  const role = useSelector((state) => state?.user?.role)

  function handleLogout(e) {
    e.preventDefault();
    let res = dispatch(logout());

    if(res?.payload?.success) {
      toast.success("Logged out succesfully")
      navigate("/");
    }
  }

  function changeWidth() {
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = 'auto';
  }

  function hideDrawer() {
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;

    changeWidth();
  }

  return (
    <div className="min-h[90vh]">
      <div className="drawer absolute left-0 z-50 w-fit">
        <input id="my-drawer" type="checkbox" className="drawer-toggle"/>
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu 
              onClick={changeWidth}
              size={"32px"}
              className="font-bold text-white m-4"
            />
          </label>
        </div>
        <div className="drawer-side w-0">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay">
          </label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content relative">
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24}/>
              </button>
            </li>
            <li><Link to="/">Home</Link></li>
            {isLoggedIn && (
              <li><Link to={`${role}/dashboard`}>Dashboard</Link></li>
            )}
            <li><Link to="/course">Courses</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            {(role === 'organization' || role === 'teacher') && (
              <li><Link to="/create-course">Create Course</Link></li>
            )}
            {!isLoggedIn && (
              <div className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-evenly">
                  <button className="btn-primary w-5/12 px-4 py-2 font-semibold rounded-md">
                    <Link to="/login">Login</Link>
                  </button>
                  <button className="btn-secondary w-5/12 px-4 py-2 font-semibold rounded-md ">
                    <Link to="/signup">Sign Up</Link>
                  </button>
                </div>
              </div>
            )}
            {isLoggedIn && (
              <div className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-evenly">
                  <button className="btn-primary w-5/12 px-4 py-2 font-semibold rounded-md ">
                    <Link to="/profile">Profile</Link>
                  </button>
                  <button className="btn-secondary w-5/12 px-4 py-2 font-semibold rounded-md " onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>

      {children}

      <Footer />
    </div>

  )
}