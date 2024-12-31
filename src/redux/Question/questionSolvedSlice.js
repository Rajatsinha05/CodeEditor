import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Helper function for error handling
const handleApiError = (error, rejectWithValue) =>
  rejectWithValue(error.response?.data || "An error occurred");

// Async Thunks

// Fetch all QuestionSolved records
export const fetchAllQuestionSolved = createAsyncThunk(
  "questionSolved/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/question-solved");
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch QuestionSolved records by student ID
export const fetchByStudentId = createAsyncThunk(
  "questionSolved/fetchByStudentId",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/question-solved/student/${studentId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch QuestionSolved records by both student ID and question ID
export const fetchByStudentIdAndQuestionId = createAsyncThunk(
  "questionSolved/fetchByStudentIdAndQuestionId",
  async ({ studentId, questionId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/question-solved/student/${studentId}/question/${questionId}`
      );

      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch QuestionSolved records by question ID
export const fetchByQuestionId = createAsyncThunk(
  "questionSolved/fetchByQuestionId",
  async (questionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/question-solved/question/${questionId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Save a QuestionSolved record
export const saveQuestionSolved = createAsyncThunk(
  "questionSolved/save",
  async (questionSolvedDTO, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/question-solved",
        questionSolvedDTO
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Initial State
const initialState = {
  allRecords: [],
  studentRecords: [],
  questionRecords: [],
  combinedRecord: [],
  loading: false,
  error: null,
  isFetched: false,
};

// Slice
const questionSolvedSlice = createSlice({
  name: "questionSolved",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Reducers
      .addCase(fetchAllQuestionSolved.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuestionSolved.fulfilled, (state, action) => {
        state.allRecords = action.payload;
        state.loading = false;
        state.isFetched = true;
      })
      .addCase(fetchAllQuestionSolved.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by Student ID Reducers
      .addCase(fetchByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByStudentId.fulfilled, (state, action) => {
        state.studentRecords = action.payload;
        state.loading = false;
      })
      .addCase(fetchByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by Question ID Reducers
      .addCase(fetchByQuestionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByQuestionId.fulfilled, (state, action) => {
        state.questionRecords = action.payload;
        state.loading = false;
      })
      .addCase(fetchByQuestionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by Student ID and Question ID Reducers
      .addCase(fetchByStudentIdAndQuestionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByStudentIdAndQuestionId.fulfilled, (state, action) => {
        state.combinedRecord = action.payload;
        state.loading = false;
      })
      .addCase(fetchByStudentIdAndQuestionId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save Record Reducers
      .addCase(saveQuestionSolved.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveQuestionSolved.fulfilled, (state, action) => {
        state.allRecords.push(action.payload);
        state.loading = false;
      })
      .addCase(saveQuestionSolved.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Reducer export
export const questionSolvedReducer = questionSolvedSlice.reducer;
