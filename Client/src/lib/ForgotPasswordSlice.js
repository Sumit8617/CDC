import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

// Send forgot-password email
export const sendResetEmail = createAsyncThunk(
  "forgotPassword/sendResetEmail",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/v1/auth/forgot-password", {
        email,
      });
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
      });
  },
});

export const { resetState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
