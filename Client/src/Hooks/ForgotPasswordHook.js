// src/Hooks/ForgotPasswordHook.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendResetEmail,
  verifyResetOTP,
  resetPassword as resetPasswordThunk,
  resetState,
} from "../lib/ForgotPasswordSlice";

export const useForgotPassword = () => {
  const dispatch = useDispatch();

  const { loading, success, error, message } = useSelector(
    (state) => state.forgotPassword
  );

  // Send reset email
  const handleSendEmail = useCallback(
    async (email) => {
      try {
        const res = await dispatch(sendResetEmail(email)).unwrap();
        return res;
      } catch (err) {
        console.error("Failed to send reset email:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Verify OTP
  const handleVerifyOTP = useCallback(
    async ({ email, otp }) => {
      try {
        const res = await dispatch(verifyResetOTP({ email, otp })).unwrap();
        return res;
      } catch (err) {
        console.error("Failed to verify OTP:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Reset password (set new password after OTP verified)
  const handleResetPassword = useCallback(
    async ({ email, newPassword, confirmPassword }) => {
      try {
        const res = await dispatch(
          resetPasswordThunk({ email, newPassword, confirmPassword })
        ).unwrap();
        return res;
      } catch (err) {
        console.error("Failed to reset password:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Clear slice state
  const clearState = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  return {
    loading,
    success,
    error,
    message,
    handleSendEmail,
    handleVerifyOTP,
    handleResetPassword,
    clearState,
  };
};

export default useForgotPassword;
