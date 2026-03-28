import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./AxiosInstance";

export const submitContactMessage = createAsyncThunk(
  "contact/submitMessage",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/api/v1/contact/submit", formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearContactState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitContactMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Message sent successfully!";
      })
      .addCase(submitContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;
