import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Trophy, Users, ShieldUser, FileText } from "lucide-react";
import axiosClient from "./AxiosInstance";

// Contest Count
export const fetchContest = createAsyncThunk(
  "stats/fetchContestsOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/api/v1/admin/auth/get-contest`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// User Stats
export const fetchUsers = createAsyncThunk("stats/fetchUsers", async () => {
  try {
    const res = await axiosClient.get(`/api/v1/admin/auth/get-user`);
    const data = res.data.data;
    console.log("User Stats Response:", data);

    return {
      totalUsers: data.totalUsers || 0,
      userDetails: data.userDetails || [],
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
});

// Admin Stats
export const fetchAdmins = createAsyncThunk(
  "stats/fetchAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/api/v1/admin/auth/get-admin`);
      return {
        totalAdmin: res.data.data.totalAdmin,
        adminDetails: res.data.data.adminDetails,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Block user
export const blockUser = createAsyncThunk(
  "stats/blockUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/api/v1/admin/auth/block-user/${userId}`);
      return { userId, message: res.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to block user";
      return rejectWithValue(errorMessage);
    }
  }
);

// Unblock user
export const unblockUser = createAsyncThunk(
  "stats/unblockUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/api/v1/admin/auth/unblock-user/${userId}`);
      return { userId, message: res.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to unblock user";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice

const adminStatsSlice = createSlice({
  name: "adminStats",
  initialState: {
    stats: [
      { title: "Total Contest", value: "0", icon: Trophy },
      { title: "Registered Users", value: "0", icon: Users },
      { title: "Number of Admin", value: "0", icon: ShieldUser },
      { title: "Total Submissions", value: "0", icon: FileText },
    ],
    recentContests: [],
    userDetails: [],
    adminDetails: [],

    // Separate loading/error flags
    loading: {
      contest: false,
      users: false,
      admins: false,
    },
    error: {
      contest: null,
      users: null,
      admins: null,
    },
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Contest
      .addCase(fetchContest.pending, (state) => {
        state.loading.contest = true;
        state.error.contest = null;
      })
      .addCase(fetchContest.fulfilled, (state, action) => {
        state.stats[0].value = String(action.payload.totalContest);
        state.recentContests = action.payload.recentContests || [];
        state.loading.contest = false;
      })
      .addCase(fetchContest.rejected, (state, action) => {
        state.loading.contest = false;
        state.error.contest = action.payload || action.error.message;
      })

      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading.users = true;
        state.error.users = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.stats[1].value = String(action.payload.totalUsers);
        state.userDetails = action.payload.userDetails;
        state.loading.users = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.payload || action.error.message;
      })

      // Admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading.admins = true;
        state.error.admins = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.stats[2].value = String(action.payload.totalAdmin);
        state.adminDetails = action.payload.adminDetails;
        state.loading.admins = false;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading.admins = false;
        state.error.admins = action.payload || action.error.message;
      })

      // Block user
      .addCase(blockUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        const user = state.userDetails.find(u => u._id === userId);
        if (user) {
          user.isBlocked = true;
        }
      })

      // Unblock user
      .addCase(unblockUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        const user = state.userDetails.find(u => u._id === userId);
        if (user) {
          user.isBlocked = false;
        }
      })

      // Handle rejected cases (error handling is done in component)
      .addCase(blockUser.rejected, (state, action) => {
        // Error is passed to component via rejectWithValue
        console.error("Block user rejected:", action.payload);
      })
      .addCase(unblockUser.rejected, (state, action) => {
        // Error is passed to component via rejectWithValue
        console.error("Unblock user rejected:", action.payload);
      });
  },
});

export default adminStatsSlice.reducer;
