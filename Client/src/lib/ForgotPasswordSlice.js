import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

// Send forgot-password email
export const sendResetEmail = createAsyncThunk(
  "forgotPassword/sendResetEmail",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(
        "/api/v1/user/forgot-password/send-otp",
        { email }
      );
      return res.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      return rejectWithValue(message);
    }
  }
);

// Verify OTP
export const verifyResetOTP = createAsyncThunk(
  "forgotPassword/verifyResetOTP",
  async ({ otp }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(
        "/api/v1/user/forgot-password/verify-otp",
        { otp }
      );
      return res.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      return rejectWithValue(message);
    }
  }
);

// Reset password (set new password after OTP verified)
export const resetPassword = createAsyncThunk(
  "forgotPassword/resetPassword",
  async ({ newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(
        "/api/v1/user/forgot-password/change-password",
        { newPassword, confirmPassword }
      );
      return res.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      return rejectWithValue(message);
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: null,
  },

  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(sendResetEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Reset link sent";
      })
      .addCase(sendResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(verifyResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(verifyResetOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "OTP verified";
      })
      .addCase(verifyResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
