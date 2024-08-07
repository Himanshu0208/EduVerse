import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function RequireAuth({ allowedRoles }) {
  const {isLoggedIn, role} = useSelector((state) => state.user)
  const location = useLocation();

  return isLoggedIn && allowedRoles.find((myrole) => myrole === role) ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to={"/denied"} state={{from: location}} replace />
  ) : (
    <Navigate to={"/login"} state={{from: location}} replace />
  );
}

