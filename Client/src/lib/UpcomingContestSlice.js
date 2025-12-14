import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

// Async thunk to fetch upcoming contests from API
export const fetchUpcomingContests = createAsyncThunk(
  "upcomingContests/fetchUpcomingContests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/api/v1/user/upcoming-contests");
      return data.data; // contests array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  contests: [],
  loading: false,
  error: null,
};

const upcomingContestsSlice = createSlice({
  name: "upcomingContests",
  initialState,
  reducers: {
    resetUpcomingContests: (state) => {
      state.contests = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload;
      })
      .addCase(fetchUpcomingContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpcomingContests } = upcomingContestsSlice.actions;
export default upcomingContestsSlice.reducer;
