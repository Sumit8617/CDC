import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../AxiosInstance";

// Get contests action
export const getContests = createAsyncThunk(
  "contests/getContests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/api/v1/admin/get-contest");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get single contest by ID action
export const getContestById = createAsyncThunk(
  "contests/getContestById",
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/api/v1/admin/get-contest/${contestId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update contest action
export const updateContest = createAsyncThunk(
  "contests/updateContest",
  async ({ contestId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        `/api/v1/admin/update-contest/${contestId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update draft contest action
export const updateDraft = createAsyncThunk(
  "contests/updateDraft",
  async ({ contestId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        `/api/v1/admin/drafts/${contestId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Publish draft contest action
export const publishDraft = createAsyncThunk(
  "contests/publishDraft",
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        `/api/v1/admin/drafts/${contestId}/publish`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete contest action
export const deleteContest = createAsyncThunk(
  "contests/deleteContest",
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(
        `/api/v1/admin/delete-contest/${contestId}`
      );
      return contestId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  contests: [],
  totalContests: 0,
  currentContest: null,
  loading: false,
  error: null,
};

// Slice
const contestsSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {
    clearCurrentContest: (state) => {
      state.currentContest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get contests
      .addCase(getContests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload.data.contestDetails;
        state.totalContests = action.payload.data.totalContests;
      })

      .addCase(getContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single contest by ID
      .addCase(getContestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContest = action.payload.data.contest;
      })
      .addCase(getContestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update contest
      .addCase(updateContest.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contests.findIndex(
          (contest) => contest._id === action.payload.updatedContest._id
        );
        if (index >= 0) {
          state.contests[index] = action.payload.updatedContest;
        }
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update draft contest
      .addCase(updateDraft.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDraft.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contests.findIndex(
          (contest) => contest._id === action.payload.contest._id
        );
        if (index >= 0) {
          state.contests[index] = action.payload.contest;
        }
      })
      .addCase(updateDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Publish draft contest
      .addCase(publishDraft.pending, (state) => {
        state.loading = true;
      })
      .addCase(publishDraft.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contests.findIndex(
          (contest) => contest._id === action.payload.contest._id
        );
        if (index >= 0) {
          state.contests[index] = action.payload.contest;
        }
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete contest
      .addCase(deleteContest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContest.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = state.contests.filter(
          (contest) => contest._id !== action.payload
        );
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Reducer
export const { clearCurrentContest } = contestsSlice.actions;
export default contestsSlice.reducer;
