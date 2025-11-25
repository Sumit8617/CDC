import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.withCredentials = true;

export const fetchContestDetails = createAsyncThunk(
  "contest/fetchContestDetails",
  async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/api/v1/user/contest-details`
    );
    return res.data.data; // Expecting an array of contests now
  }
);

export const previousContestQuestions = createAsyncThunk(
  "contest/previousContestQuestions",
  async (contestId) => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/api/v1/user/previous-contest-questions/${contestId}`
    );
    return res.data.data;
  }
);

const contestDeatilsSlice = createSlice({
  name: "contestDetails",
  initialState: {
    contests: [],
    questions: [],
    loading: false,
    errors: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchContestDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload;
      })
      .addCase(fetchContestDetails.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error.message;
      })
      .addCase(previousContestQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(previousContestQuestions.fulfilled, (state, action) => {
        state.questions = action.payload.questions || [];
        state.loading = false;
      })
      .addCase(previousContestQuestions.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.error.message;
      });
  },
});

export default contestDeatilsSlice.reducer;
