import { useDispatch, useSelector } from "react-redux";
import { login, adminLogin, logoutUser } from "../lib/UserAuthSlice";
import { useCallback } from "react";

const useLogin = () => {
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.auth);

  // Normal User Login
  const handleLogin = useCallback(
    async (credentials) => {
      try {
        const result = await dispatch(login(credentials)).unwrap();
        return result;
      } catch (err) {
        console.error("User Login failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Admin Login
  const handleAdminLogin = useCallback(
    async (credentials) => {
      try {
        const result = await dispatch(adminLogin(credentials)).unwrap();
        return result;
      } catch (err) {
        console.error("Admin Login failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Logout
  const handleLogout = useCallback(async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();
      return result;
    } catch (err) {
      console.error("Logout failed:", err);
      throw err;
    }
  }, [dispatch]);

  return {
    handleLogin,
    handleAdminLogin,
    handleLogout,
    user,
    loading,
    error,
  };
};

export default useLogin;
