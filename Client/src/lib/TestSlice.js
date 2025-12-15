import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

// Fetch contests
export const fetchContestDetails = createAsyncThunk(
  "contest/fetchContestDetails",
  async () => {
    const res = await axiosClient.get(`/api/v1/user/contest-details`);
    return res.data.data.formattedContests;
  }
);

// Fetch previous contest questions
export const previousContestQuestions = createAsyncThunk(
  "contest/previousContestQuestions",
  async (contestId) => {
    const res = await axiosClient.get(
      `/api/v1/user/previous-contest-questions/${contestId}`
    );
    return res.data.data;
  }
);

const contestDetailsSlice = createSlice({
  name: "contestDetails",
  initialState: {
    contests: [],
    questions: [],
    contestsLoading: false,
    contestsError: null,
    questionsLoading: false,
    questionsError: null,
  },

  extraReducers: (builder) => {
    // Contests
    builder
      .addCase(fetchContestDetails.pending, (state) => {
        state.contestsLoading = true;
        state.contestsError = null;
      })
      .addCase(fetchContestDetails.fulfilled, (state, action) => {
        state.contestsLoading = false;
        state.contests = action.payload;
      })
      .addCase(fetchContestDetails.rejected, (state, action) => {
        state.contestsLoading = false;
        state.contestsError = action.error.message;
      });

    // Questions
    builder
      .addCase(previousContestQuestions.pending, (state) => {
        state.questionsLoading = true;
        state.questionsError = null;
      })
      .addCase(previousContestQuestions.fulfilled, (state, action) => {
        state.questionsLoading = false;
        state.questions = action.payload.questions || [];
      })
      .addCase(previousContestQuestions.rejected, (state, action) => {
        state.questionsLoading = false;
        state.questionsError =
          action.error.message || "Unable to fetch contest questions.";
      });
  },
});

export default contestDetailsSlice.reducer;
