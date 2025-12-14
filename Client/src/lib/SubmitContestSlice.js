import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

export const submitContest = createAsyncThunk(
  "contestSubmission/submitContest",
  async ({ questions, contest, user }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/v1/user/submit-contest", {
        questions,
        contest,
        user,
      });
      if (res.status !== 200) {
        console.log("Submission Error Response:", res.data);
        return rejectWithValue(res.data);
      }
      console.log("Submission Response:", res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Failed to submit contest",
        }
      );
    }
  }
);

const initialState = {
  submission: null,
  contest: null,
  loading: false,
  success: false,
  error: null,
};

const contestSubmissionSlice = createSlice({
  name: "contestSubmission",
  initialState,
  reducers: {
    resetSubmissionState: (state) => {
      state.submission = null;
      state.contest = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(submitContest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submission = action.payload?.data?.submission;
        state.contest = action.payload?.data?.contest;
      })

      .addCase(submitContest.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Submission failed";
      });
  },
});

export const { resetSubmissionState } = contestSubmissionSlice.actions;

export default contestSubmissionSlice.reducer;
