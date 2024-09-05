import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";

// Define an async thunk to create a contest
export const createContest = createAsyncThunk(
  "contests/createContest",
  async (contestData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/contests", contestData);
      return response.data;
    } catch (error) {
      // Use error.response?.data to prevent accessing undefined properties
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Define an async thunk to fetch all contests
export const fetchContests = createAsyncThunk(
  "contests/fetchContests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/contests");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Define an async thunk to fetch a contest by ID
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

// Define an async thunk to update a contest
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
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Define an async thunk to delete a contest
export const deleteContest = createAsyncThunk(
  "contests/deleteContest",
  async (contestId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/contests/${contestId}`);
      return contestId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Define the initial state for contests
const initialContestState = {
  contests: [],
  contest: {},
  loading: false,
  error: null,
};

// Create a slice for contests
export const contestSlice = createSlice({
  name: "contests",
  initialState: initialContestState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Contest Reducer
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

      // Fetch Contests Reducer
      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.contests = action.payload;
        state.loading = false;
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Contest by ID Reducer
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

      // Update Contest Reducer
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

      // Delete Contest Reducer
      .addCase(deleteContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContest.fulfilled, (state, action) => {
        state.contests = state.contests.filter(
          (contest) => contest.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer for contests
export const contestActions = contestSlice.actions;
export const contestReducer = contestSlice.reducer;
