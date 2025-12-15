import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

const extractUser = (payload) => {
  if (!payload) return null;

  // From user-details endpoint
  if (payload.data?.user) return payload.data.user;

  // From login endpoint
  if (payload.user) return payload.user;

  return null;
};

//  SEND OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ fullName, email }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axiosClient.post(
        `/api/v1/user/send-otp`,
        { fullName, email },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

// VERIFY OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ otp }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axiosClient.post(
        `/api/v1/user/verify-otp`,
        { otp },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/api/v1/user/signup`, userData, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Signup failed. Try again."
      );
    }
  }
);

// User LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/api/v1/user/login`, userData, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error("ERR While Login", error);
      return rejectWithValue(
        error.response?.data?.message || "Login Failed. Try again"
      );
    }
  }
);

// Admin Login
export const adminLogin = createAsyncThunk(
  "auth/adminlogin",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`/api/v1/admin/auth/login`, userData);
      return res.data;
    } catch (error) {
      console.error("ERR While Login", error);
      return rejectWithValue(
        error.response?.data?.message || "Login Failed. Try again"
      );
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(
        `/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed. Try again."
      );
    }
  }
);

// Fetch User Details
export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async () => {
    const res = await axiosClient.get(`/api/v1/user/user-details`, {
      withCredentials: true,
    });
    return res.data || null;
  }
);

// Upload image
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const isFormData = payload instanceof FormData;
      const config = isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

      const res = await axiosClient.put(
        `/api/v1/user/updateProfile`,
        payload,
        config
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update profile");
    }
  }
);

// Change Password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put(
        `/api/v1/user/change-password`,
        payload
      );

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.delete(
        `/api/v1/admin/auth/delete-user/${userId}`
      );
      return res.data;
    } catch (error) {
      // axios error response
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// INITIAL USER
const initialUser = (() => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

//  SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    loading: false,
    error: null,
    success: false,
    otpSent: false,
    otpVerified: false,
  },

  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.success = false;
      state.otpSent = false;
      state.otpVerified = false;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      try {
        if (action.payload)
          localStorage.setItem("user", JSON.stringify(action.payload));
        else localStorage.removeItem("user");
      } catch (e) {
        console.error(e);
      }
    },

    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.otpSent = false;
      state.otpVerified = false;
      try {
        localStorage.removeItem("user");
      } catch (e) {
        console.error(e);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // SEND OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpSent = false;
      })

      //  Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpVerified = false;
      })

      //  Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const user = extractUser(action.payload);

        if (user) {
          state.user = user;
          try {
            localStorage.setItem("user", JSON.stringify(user));
          } catch (e) {
            console.error(e);
          }
        } else {
          state.user = null;
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const user = extractUser(action.payload);
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;

        const raw = action.payload?.data;
        if (raw) {
          // Construct a proper user object
          const user = {
            _id: raw.user,
            role: raw.role,
          };

          state.user = user;
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          state.user = null;
        }
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.success = false;
        state.otpSent = false;
        state.otpVerified = false;

        try {
          localStorage.removeItem("user");
        } catch (e) {
          console.error(e);
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        const user = extractUser(action.payload);
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        const user = extractUser(action.payload);
        state.user = user || state.user;
        try {
          user && localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.error(e);
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      });
  },
});

export const { clearAuthState, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
