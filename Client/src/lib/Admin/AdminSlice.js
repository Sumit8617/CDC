import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../AxiosInstance";

export const adminInvite = createAsyncThunk(
  "adminInvite",
  async ({ fullName, email }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(`/api/v1/admin/auth/invite`, {
        fullName,
        email,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send admin invite"
      );
    }
  }
);

const initialState = {
  inviteLoading: false,
  inviteError: null,
  inviteSuccess: null,
  inviteLink: null,
};

const adminInviteSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetInviteState: (state) => {
      state.inviteLoading = false;
      state.inviteError = null;
      state.inviteSuccess = null;
      state.inviteLink = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Admin Invite
      .addCase(adminInvite.pending, (state) => {
        state.inviteLoading = true;
        state.inviteError = null;
        state.inviteSuccess = null;
        state.inviteLink = null;
      })
      .addCase(adminInvite.fulfilled, (state, action) => {
        state.inviteLoading = false;
        state.inviteSuccess = action.payload.message;
        state.inviteLink = action.payload.data; // invite link from backend
      })
      .addCase(adminInvite.rejected, (state, action) => {
        state.inviteLoading = false;
        state.inviteError = action.payload;
      });
  },
});

export const { resetInviteState } = adminInviteSlice.actions;
export default adminInviteSlice.reducer;
