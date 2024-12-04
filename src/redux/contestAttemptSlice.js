import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";
import { generateLongIdFromUUID } from "../utils/idHelper";

// Async thunk to start a contest attempt
export const startContestAttempt = createAsyncThunk(
  "contestAttempts/start",
  async ({ contestId, studentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/contest-attempts/start", {
        contestId,
        studentId,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while starting the contest attempt."
      );
    }
  }
);

// Async thunk to end a contest attempt
export const endContestAttempt = createAsyncThunk(
  "contestAttempts/end",
  async ({ attemptId }, { rejectWithValue }) => {
    console.log("Processing endContestAttempt for attemptId:", attemptId);
    try {
      // Sending request to the backend with query parameters
      const response = await axiosInstance.post("/contest-attempts/end", null, {
        params: { attemptId }, // These will be sent as query parameters
      });

      console.log("Response received:", response.data);
      return response.data; // Return the response data to the caller
    } catch (error) {
      console.error("Error ending contest attempt:", error);
      return rejectWithValue(
        error.response?.data || "An error occurred while ending the contest attempt."
      );
    }
  }
);

// Other thunks and the contestAttemptSlice remain unchanged

// Async thunk to fetch a specific contest attempt by ID
export const fetchContestAttemptById = createAsyncThunk(
  "contestAttempts/fetchById",
  async (attemptId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/contest-attempts/${attemptId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching the contest attempt by ID."
      );
    }
  }
);

// Async thunk to fetch all contest attempts for a specific contest by contestId
export const fetchContestAttemptsByContestId = createAsyncThunk(
  "contestAttempts/fetchByContestId",
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/contest-attempts/by-contest/${contestId}`
      );
      console.log(
        "Fetch All Contest Attempts by Contest ID Response: ",
        response.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching the contest attempts by contest ID."
      );
    }
  }
);
export const fetchContestAttemptsByStudentAndContest = createAsyncThunk(
  "contestAttempts/fetchByStudentAndContest",
  async ({ studentId, contestId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/contest-attempts/by-student-and-contest`,
        { params: { studentId, contestId } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching contest attempts by student and contest."
      );
    }
  }
);

// Define the initial state for contest attempts
const initialContestAttemptsState = {
  contestAttempts: [], // List of contest attempts (DTO format)
  contestAttempt: {}, // Specific contest attempt details (DTO format)
  loading: {
    start: false,
    end: false,
    fetch: false,
    fetchAll: false,
  }, // Loading states for each operation
  error: {
    start: null,
    end: null,
    fetch: null,
    fetchAll: null,
  }, // Store error messages for each operation
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
        state.loading.start = true;
        state.error.start = null;
      })
      .addCase(startContestAttempt.fulfilled, (state, action) => {
        state.loading.start = false;
        state.contestAttempts.push(action.payload);
      })
      .addCase(startContestAttempt.rejected, (state, action) => {
        state.loading.start = false;
        state.error.start = action.payload;
      })

      // End Contest Attempt Reducers
      .addCase(endContestAttempt.pending, (state) => {
        state.loading.end = true;
        state.error.end = null;
      })
      .addCase(endContestAttempt.fulfilled, (state, action) => {
        state.loading.end = false;
        const index = state.contestAttempts.findIndex(
          (attempt) => attempt.id === action.payload.id
        );
        if (index !== -1) {
          state.contestAttempts[index] = action.payload;
        }
      })
      .addCase(endContestAttempt.rejected, (state, action) => {
        state.loading.end = false;
        state.error.end = action.payload;
      })

      // Fetch Specific Contest Attempt by ID Reducers
      .addCase(fetchContestAttemptById.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchContestAttemptById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.contestAttempt = action.payload;
      })
      .addCase(fetchContestAttemptById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })

      // Fetch All Contest Attempts by Contest ID Reducers
      .addCase(fetchContestAttemptsByContestId.pending, (state) => {
        state.loading.fetchAll = true;
        state.error.fetchAll = null;
      })
      .addCase(fetchContestAttemptsByContestId.fulfilled, (state, action) => {
        state.loading.fetchAll = false;
        state.contestAttempts = action.payload;
      })
      .addCase(fetchContestAttemptsByContestId.rejected, (state, action) => {
        state.loading.fetchAll = false;
        state.error.fetchAll = action.payload;
      })
      .addCase(fetchContestAttemptsByStudentAndContest.pending, (state) => {
        state.loading.fetchAll = true;
        state.error.fetchAll = null;
      })
      .addCase(
        fetchContestAttemptsByStudentAndContest.fulfilled,
        (state, action) => {
          state.loading.fetchAll = false;
          state.contestAttempts = action.payload;
        }
      )
      .addCase(
        fetchContestAttemptsByStudentAndContest.rejected,
        (state, action) => {
          state.loading.fetchAll = false;
          state.error.fetchAll = action.payload;
        }
      );
  },
});

export const contestAttemptReducer = contestAttemptSlice.reducer;
