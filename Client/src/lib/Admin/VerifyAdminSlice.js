import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../AxiosInstance";

export const verifyAdminInvite = createAsyncThunk(
  "verifyAdmin",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/api/v1/admin/auth/verify`, {
        params: { token },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid or expired token"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  data: null,
};

const verifyAdminSlice = createSlice({
  name: "verifyAdmin",
  initialState,
  reducers: {
    resetVerifyState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAdminInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAdminInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(verifyAdminInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVerifyState } = verifyAdminSlice.actions;
export default verifyAdminSlice.reducer;
