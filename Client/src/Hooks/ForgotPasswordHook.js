// src/Hooks/ForgotPasswordHook.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendResetEmail, resetState } from "../lib/ForgotPasswordSlice";

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
        return res; // in case you want to use response later
      } catch (err) {
        console.error("Failed to send reset email:", err);
        throw err;
      }
    },
    [dispatch]
  );

  // Clear slice state (used in ForgotPassword.jsx)
  const clearState = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  return {
    loading,
    success,
    error,
    message,
    handleSendEmail,
    clearState,
  };
};

export default useForgotPassword;
