import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../AxiosInstance";

// Async thunk to register admin
export const registerAdmin = createAsyncThunk(
  "registerAdmin",
  async (
    { token, password, mobileNumber, rollNumber, dob, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosClient.post(`/api/v1/admin/auth/register`, {
        token,
        password,
        mobileNumber,
        rollNumber,
        dob,
        confirmPassword,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to register admin"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: null,
  adminData: null,
};

const registerAdminSlice = createSlice({
  name: "registerAdmin",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.adminData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.adminData = action.payload.data;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRegisterState } = registerAdminSlice.actions;
export default registerAdminSlice.reducer;
