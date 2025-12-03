import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  sendOtp,
  verifyOtp,
  fetchUserDetails,
  updateProfile,
  changePassword,
} from "../lib/UserAuthSlice";
import { useCallback, useState } from "react";

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

  const [loadingUser, setLoadingUser] = useState(false); // boolean
  const user = reduxUser; // derive directly from Redux

  // Fetch User Details
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

  // Signup User
  const handleSignup = useCallback(
    async (data) => {
      try {
        const res = await dispatch(signupUser(data)).unwrap();
        return res?.data?.user || res?.user || null;
      } catch (err) {
        console.error("Signup failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Send OTP
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

  // Verify OTP
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

  // Upload Image
  const handleUpdateProfile = useCallback(
    async (payload) => {
      try {
        const updated = await dispatch(updateProfile(payload)).unwrap();
        return updated?.data?.user || updated?.user || null;
      } catch (err) {
        console.error("Profile update failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Change Password
  const handleChangePassword = useCallback(
    async (payload) => {
      try {
        const res = await dispatch(changePassword(payload)).unwrap();
        return res || true;
      } catch (err) {
        console.error("Password change failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  return {
    handleSignup,
    handleSendOtp,
    handleVerifyOtp,
    handleFetchUserDetails,
    handleUpdateProfile,
    loading,
    loadingUser,
    error,
    success,
    otpSent,
    otpVerified,
    user,
    handleChangePassword,
  };
};

export default useSignup;
