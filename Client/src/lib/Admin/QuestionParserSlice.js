import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../AxiosInstance";

// Async thunk for uploading and parsing questions from file
export const parseQuestionsFromFile = createAsyncThunk(
  "questionParser/parseQuestions",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.post(
        "/api/v1/admin/parse-questions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data; // Return the questions array from the response
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to parse file"
      );
    }
  }
);

// Async thunk for uploading PDF with images
export const parseQuestionsWithImages = createAsyncThunk(
  "questionParser/parseQuestionsWithImages",
  async ({ file, images = [] }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Append each image to the form
      images.forEach((image, index) => {
        // Convert base64 to blob if needed
        if (typeof image === 'string' && image.startsWith('data:')) {
          fetch(image)
            .then(res => res.blob())
            .then(blob => {
              const fileName = `image_${index}.${blob.type.split('/')[1] || 'png'}`;
              formData.append("images", new File([blob], fileName, { type: blob.type }));
            });
        } else if (image instanceof File) {
          formData.append("images", image);
        }
      });

      // Wait a bit for the blob conversions to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await axiosClient.post(
        "/api/v1/admin/parse-questions-with-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to parse file with images"
      );
    }
  }
);

const initialState = {
  questions: [],
  loading: false,
  success: false,
  error: null,
  totalQuestions: 0,
};

const questionParserSlice = createSlice({
  name: "questionParser",
  initialState,
  reducers: {
    resetParserState: (state) => {
      state.questions = [];
      state.loading = false;
      state.success = false;
      state.error = null;
      state.totalQuestions = 0;
    },
    clearExtractedQuestions: (state) => {
      state.questions = [];
      state.totalQuestions = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Parse questions pending
      .addCase(parseQuestionsFromFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Parse questions fulfilled
      .addCase(parseQuestionsFromFile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.questions = action.payload.questions || [];
        state.totalQuestions = action.payload.totalQuestions || state.questions.length;
      })
      // Parse questions rejected
      .addCase(parseQuestionsFromFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to parse file";
        state.success = false;
      })
      // Parse questions with images pending
      .addCase(parseQuestionsWithImages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Parse questions with images fulfilled
      .addCase(parseQuestionsWithImages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.questions = action.payload.questions || [];
        state.totalQuestions = action.payload.totalQuestions || state.questions.length;
      })
      // Parse questions with images rejected
      .addCase(parseQuestionsWithImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to parse file with images";
        state.success = false;
      });
  },
});

export const { resetParserState, clearExtractedQuestions } = questionParserSlice.actions;
export default questionParserSlice.reducer;
