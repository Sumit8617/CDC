import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

// Async thunk to fetch the most recent leaderboard
export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/api/v1/user/leaderboard");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  contest: null,
  leaderboard: [],
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    resetLeaderboard: (state) => {
      state.contest = null;
      state.leaderboard = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.contest = action.payload.contest;
        state.leaderboard = action.payload.leaderboard;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch leaderboard";
      });
  },
});

export const { resetLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
