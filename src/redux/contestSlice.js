import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";
import { generateLongIdFromUUID } from "../utils/idHelper";

// Helper function to handle API errors
const handleApiError = (error, rejectWithValue) =>
  rejectWithValue(error.response?.data || "An error occurred");

// Async thunk to create a contest
export const createContest = createAsyncThunk(
  "contests/createContest",
  async (contestData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/contests/contestcreate", {
        ...contestData,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Async thunk to fetch all contests
export const fetchContests = createAsyncThunk(
  "contests/fetchContests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/contests");
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Async thunk to fetch contests by student ID
export const fetchContestsByStudent = createAsyncThunk(
  "contests/fetchContestsByStudent",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/contests/student/${studentId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Async thunk to fetch a contest by ID
export const getContestById = createAsyncThunk(
  "contests/getContestById",
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/contests/${contestId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Async thunk to update a contest
export const updateContest = createAsyncThunk(
  "contests/updateContest",
  async ({ contestId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/contests/${contestId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Async thunk to delete a contest
export const deleteContestById = createAsyncThunk(
  "contests/deleteContest",
  async (contestId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/contests/${contestId}`);
      return contestId;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Define the initial state for contests
const initialState = {
  contests: [],
  contest: null,
  loading: false,
  error: null,
  isFetched: false,
};

// Create the slice for contests
export const contestSlice = createSlice({
  name: "contests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Contest Reducers
      .addCase(createContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.contests.push(action.payload);
        state.loading = false;
      })
      .addCase(createContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Contests Reducers
      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isFetched = false;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.contests = action.payload;
        state.loading = false;
        state.isFetched = true;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Contests by Student Reducers
      .addCase(fetchContestsByStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContestsByStudent.fulfilled, (state, action) => {
        state.contests = action.payload;
        state.loading = false;
        state.isFetched = true;
      })
      .addCase(fetchContestsByStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Contest by ID Reducers
      .addCase(getContestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContestById.fulfilled, (state, action) => {
        state.contest = action.payload;
        state.loading = false;
      })
      .addCase(getContestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Contest Reducers
      .addCase(updateContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContest.fulfilled, (state, action) => {
        const index = state.contests.findIndex(
          (contest) => contest.id === action.payload.id
        );
        if (index !== -1) {
          state.contests[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Contest Reducers
      .addCase(deleteContestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContestById.fulfilled, (state, action) => {
        state.contests = state.contests.filter(
          (contest) => contest.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteContestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const contestReducer = contestSlice.reducer;
