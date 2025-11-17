import { useDispatch, useSelector } from "react-redux";
import { login, logoutUser } from "../lib/AuthSlice";
import { useCallback } from "react";

const useLogin = () => {
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.auth);

  // Login
  const handleLogin = useCallback(
    async (credentials) => {
      try {
        const result = await dispatch(login(credentials)).unwrap();
        return result;
      } catch (err) {
        console.error("Login failed:", err);
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
    handleLogout,
    user,
    loading,
    error,
  };
};

export default useLogin;
