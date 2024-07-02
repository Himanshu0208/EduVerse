import './App.css'

import { Route,Routes } from "react-router-dom"

import RequireAuth from './Components/Auth/RequireAuth'
import Login from './Pages/Auth/Login'
import SignUp from './Pages/Auth/SignUp'
import CreateCourse from './Pages/Course/CreateCourse'
import Denied from './Pages/Denied'
import HomePage from './Pages/HomePage'
import NotFound from './Pages/NotFound'
import Profile from "./Pages/User/Profile"
// import VideoPlayer from './pages/Video'



function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path="/denied" element={<Denied />}/>
        {/* <Route path="/video" element={<VideoPlayer />}/> */}
        <Route path="/profile" element={<Profile />} />

        <Route element={<RequireAuth allowedRoles={["teacher", "organization"]} />}>
          <Route path="/create-course" element={<CreateCourse />}/>
        </Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
