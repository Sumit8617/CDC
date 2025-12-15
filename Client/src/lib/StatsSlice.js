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
      });
  },
});

export default adminStatsSlice.reducer;
