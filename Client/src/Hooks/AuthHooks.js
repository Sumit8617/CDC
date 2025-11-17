import { useDispatch, useSelector } from "react-redux";
import { signupUser, sendOtp, verifyOtp } from "../lib/AuthSlice";
import { useCallback } from "react";

const useSignup = () => {
  const dispatch = useDispatch();

  const { loading, error, success, otpSent, otpVerified } = useSelector(
    (state) => state.auth
  );

  // Signup 
  const handleSignup = useCallback(
    async (data) => {
      try {
        const result = await dispatch(signupUser(data)).unwrap();
        return result;
      } catch (err) {
        console.log("Coming from Auth Hook", data);
        console.error("Signup failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Send OTP
  const handleSendOtp = useCallback(
    async ({ fullName, email }) => {
      if (!fullName || !email) {
        console.log("Sending Mail With this ", fullName, email);
        console.warn("Full name or email missing");
        return;
      }

      try {
        const result = await dispatch(sendOtp({ fullName, email })).unwrap();
        return result;
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
        const result = await dispatch(verifyOtp({ otp })).unwrap();
        return result;
      } catch (err) {
        console.error("OTP verification failed:", err);
        throw err;
      }
    },
    [dispatch]
  );


  return {
    handleSignup,
    handleSendOtp,
    handleVerifyOtp,
    loading,
    error,
    success,
    otpSent,
    otpVerified,
  };
};

export default useSignup;
