import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";

// Async thunk to create a contest
export const createContest = createAsyncThunk(
  "contests/createContest",
  async (contestData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/contests", contestData);
      console.log('response: ', response);
      return response.data;
    } catch (error) {
      console.log('error: ', error);
      // Catch and return error
      return rejectWithValue(error.response?.data || 'An error occurred');
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
       // Useful for debugging
      return rejectWithValue(error.response?.data || 'An error occurred');
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
      
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Async thunk to update a contest
export const updateContest = createAsyncThunk(
  "contests/updateContest",
  async ({ contestId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/contests/${contestId}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Async thunk to delete a contest
export const deleteContest = createAsyncThunk(
  "contests/deleteContest",
  async (contestId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/contests/${contestId}`);
      return contestId; // Return the ID so it can be removed in the reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Define the initial state for contests
const initialContestState = {
  contests: [], // List of all contests
  contest: {},  // Specific contest details
  loading: false, // Loading state for any operation
  error: null,    // Store any error messages
};

// Create the slice for contests
export const contestSlice = createSlice({
  name: "contests",
  initialState: initialContestState,
  reducers: {}, // No custom reducers needed as of now
  extraReducers: (builder) => {
    builder
      // Create Contest Reducers
      .addCase(createContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.contests.push(action.payload); // Add new contest to list
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
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.contests = action.payload; // Update contest list
        state.loading = false;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Contest by ID Reducers
      .addCase(getContestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContestById.fulfilled, (state, action) => {
        state.contest = action.payload; // Set specific contest details
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
          state.contests[index] = action.payload; // Update contest in list
        }
        state.loading = false;
      })
      .addCase(updateContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Contest Reducers
      .addCase(deleteContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContest.fulfilled, (state, action) => {
        state.contests = state.contests.filter(
          (contest) => contest.id !== action.payload // Remove contest by ID
        );
        state.loading = false;
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer to use in the store
export const contestReducer = contestSlice.reducer;
