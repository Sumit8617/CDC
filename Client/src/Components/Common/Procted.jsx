import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// For normal users
export const UserProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// For admins
export const AdminProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("Admin Protected Route Running");
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
