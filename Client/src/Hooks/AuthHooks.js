import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  sendOtp,
  verifyOtp,
  fetchUserDetails,
  updateProfile,
  changePassword,
  deleteUser,
} from "../lib/UserAuthSlice";
import { useCallback, useState } from "react";

// Normalized user
const normalizeUser = (res) => {
  if (!res) return null;
  const user = res?.data?.user || res?.user || null;
  if (!user) return null;

  return {
    ...user,
    bestRank: user.bestRank || "N/A",
    totalContestsGiven: user.totalContestsGiven || 0,
  };
};

const useSignup = () => {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    success,
    otpSent,
    otpVerified,
    user: reduxUser,
  } = useSelector((state) => state.auth);

  const [loadingUser, setLoadingUser] = useState(false);

  const user = reduxUser ? normalizeUser({ user: reduxUser }) : null;

  // FETCH USER DETAILS
  const handleFetchUserDetails = useCallback(async () => {
    try {
      setLoadingUser(true);
      const res = await dispatch(fetchUserDetails()).unwrap();
      // Normalize user object
      return res?.data?.user || null;
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      return null;
    } finally {
      setLoadingUser(false);
    }
  }, [dispatch]);

  // SIGNUP
  const handleSignup = useCallback(
    async (data) => {
      try {
        const res = await dispatch(signupUser(data)).unwrap();
        return normalizeUser(res);
      } catch (err) {
        console.error("Signup failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // SEND OTP
  const handleSendOtp = useCallback(
    async ({ fullName, email }) => {
      try {
        return await dispatch(sendOtp({ fullName, email })).unwrap();
      } catch (err) {
        console.error("Error sending OTP:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // VERIFY OTP
  const handleVerifyOtp = useCallback(
    async (otp) => {
      try {
        return await dispatch(verifyOtp({ otp })).unwrap();
      } catch (err) {
        console.error("OTP verification failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // UPDATE PROFILE
  const handleUpdateProfile = useCallback(
    async (payload) => {
      try {
        const res = await dispatch(updateProfile(payload)).unwrap();
        return normalizeUser(res);
      } catch (err) {
        console.error("Profile update failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // CHANGE PASSWORD
  const handleChangePassword = useCallback(
    async (payload) => {
      try {
        return await dispatch(changePassword(payload)).unwrap();
      } catch (err) {
        console.error("Password change failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Delete User
  const handleDeleteUser = useCallback(
    async (userId) => {
      try {
        const res = await dispatch(deleteUser(userId)).unwrap();
        console.log("User deleted:", res);
        return res;
      } catch (err) {
        console.error("Delete user failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  return {
    user,
    loading,
    loadingUser,
    error,
    success,
    otpSent,
    otpVerified,
    handleSignup,
    handleSendOtp,
    handleVerifyOtp,
    handleFetchUserDetails,
    handleUpdateProfile,
    handleChangePassword,
    handleDeleteUser,
  };
};

export default useSignup;
