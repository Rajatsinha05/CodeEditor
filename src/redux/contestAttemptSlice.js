import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";

// Async thunk to start a contest attempt
export const startContestAttempt = createAsyncThunk(
  "contestAttempts/start",
  async ({ contestId, studentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/contest-attempts/start", { contestId, studentId });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while starting the contest attempt."
      );
    }
  }
);

// Async thunk to end a contest attempt
export const endContestAttempt = createAsyncThunk(
  "contestAttempts/end",
  async ({ attemptId, totalMarks }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/contest-attempts/end", { attemptId, totalMarks });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while ending the contest attempt."
      );
    }
  }
);

// Async thunk to fetch a specific contest attempt by ID
export const fetchContestAttemptById = createAsyncThunk(
  "contestAttempts/fetchById",
  async (attemptId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/contest-attempts/${attemptId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching the contest attempt by ID."
      );
    }
  }
);

// Define the initial state for contest attempts
const initialContestAttemptsState = {
  contestAttempts: [], // List of contest attempts
  contestAttempt: {}, // Specific contest attempt details
  loading: false, // Loading state for any operation
  error: null, // Store any error messages
};

// Create the slice for contest attempts
export const contestAttemptSlice = createSlice({
  name: "contestAttempts",
  initialState: initialContestAttemptsState,
  reducers: {}, // No custom reducers needed as of now
  extraReducers: (builder) => {
    builder
      // Start Contest Attempt Reducers
      .addCase(startContestAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startContestAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.contestAttempts.push(action.payload);
      })
      .addCase(startContestAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // End Contest Attempt Reducers
      .addCase(endContestAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endContestAttempt.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contestAttempts.findIndex(
          (attempt) => attempt.id === action.payload.id
        );
        if (index !== -1) {
          state.contestAttempts[index] = action.payload;
        }
      })
      .addCase(endContestAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Specific Contest Attempt by ID Reducers
      .addCase(fetchContestAttemptById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContestAttemptById.fulfilled, (state, action) => {
        state.contestAttempt = action.payload;
        state.loading = false;
      })
      .addCase(fetchContestAttemptById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const contestAttemptReducer = contestAttemptSlice.reducer;
