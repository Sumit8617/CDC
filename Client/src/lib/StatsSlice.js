import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Trophy, Users, ShieldUser, FileText } from "lucide-react";
import axiosClient from "./AxiosInstance";

// API Calls

// Contest Count
export const fetchContest = createAsyncThunk(
  "stats/fetchContestsOverview",
  async () => {
    const res = await axiosClient.get(`/api/v1/admin/auth/get-contest`);
    return res.data.data;
  }
);

// User Stats
export const fetchUsers = createAsyncThunk("stats/fetchUsers", async () => {
  const res = await axiosClient.get(`/api/v1/admin/auth/get-user`);
  return {
    totalUsers: res.data.data.totalUsers,
    userDetails: res.data.data.userDetails,
  };
});

// Admin Stats
export const fetchAdmins = createAsyncThunk("stats/fetchAdmins", async () => {
  const res = await axiosClient.get(`/api/v1/admin/auth/get-admin`);
  console.log("Admin Stats Response:", res);
  return {
    totalAdmin: res.data.data.totalAdmin,
    adminDetails: res.data.data.adminDetails,
  };
});

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
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Contest
      .addCase(fetchContest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContest.fulfilled, (state, action) => {
        state.stats[0].value = String(action.payload.totalContest);
        state.recentContests = action.payload.recentContests || [];
        state.loading = false;
      })

      .addCase(fetchContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.stats[1].value = String(action.payload.totalUsers);
        state.userDetails = action.payload.userDetails;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.stats[2].value = String(action.payload.totalAdmin);
        state.adminDetails = action.payload.adminDetails;
        state.loading = false;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adminStatsSlice.reducer;
