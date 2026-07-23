import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

// Async thunk to fetch shuffled questions for a specific contest
export const fetchShuffledQuestions = createAsyncThunk(
  "contest/fetchShuffledQuestions",
  async (contestId, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/api/v1/user/shuffled-questions/${contestId}`);
      return data.data; // Contains questions + positionMap
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  shuffledQuestions: null,
  loading: false,
  error: null,
};

const contestSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {
    resetShuffledQuestions: (state) => {
      state.shuffledQuestions = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShuffledQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShuffledQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.shuffledQuestions = action.payload;
      })
      .addCase(fetchShuffledQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetShuffledQuestions } = contestSlice.actions;
export default contestSlice.reducer;
