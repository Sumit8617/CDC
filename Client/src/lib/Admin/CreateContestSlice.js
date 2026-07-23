import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../AxiosInstance";

// Async thunk to create/publish contest
export const createContest = createAsyncThunk(
  "contest/createContest",
  async (contestData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/api/v1/admin/create-contest",
        contestData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Async thunk to save contest as draft
export const saveDraftContest = createAsyncThunk(
  "contest/saveDraftContest",
  async (contestData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/api/v1/admin/save-draft-contest",
        contestData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  contest: null,
  draftContest: null,
  loading: false,
  // success is null | "published" | "draft" so the UI can tell which
  // action just completed, instead of a plain boolean that can't.
  success: null,
  error: null,
};

const contestSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {
    resetContestState: (state) => {
      state.contest = null;
      state.draftContest = null;
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create/Publish contest
    builder
      .addCase(createContest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "published";
        state.contest = action.payload?.contest;
      })
      .addCase(createContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = null;
      });

    // Save Draft contest
    builder
      .addCase(saveDraftContest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(saveDraftContest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "draft";
        state.draftContest = action.payload?.contest;
      })
      .addCase(saveDraftContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = null;
      });
  },
});

export const { resetContestState } = contestSlice.actions;
export default contestSlice.reducer;
