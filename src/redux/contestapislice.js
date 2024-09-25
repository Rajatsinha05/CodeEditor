import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for the API
const API_BASE_URL = "http://localhost:8000";

// Async thunk to create a contest
export const createContest = createAsyncThunk(
  "contest/createContest",
  async (contestData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contests`,
        contestData
      );
      console.log("contestData: ", contestData);
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get all contests
export const getContests = createAsyncThunk(
  "contest/getContests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contests`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get a single contest by ID
export const getContestById = createAsyncThunk(
  "contest/getContestById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contests/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update a contest
export const updateContest = createAsyncThunk(
  "contest/updateContest",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/contests/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a contest
export const deleteContest = createAsyncThunk(
  "contest/deleteContest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/contests/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get all results of a contest
export const getContestResults = createAsyncThunk(
  "contest/getContestResults",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/contests/${id}/results`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get result of a specific student in a contest
export const getStudentResult = createAsyncThunk(
  "contest/getStudentResult",
  async ({ contestId, studentId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/contests/${contestId}/results/${studentId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to add or update a contest result
export const addOrUpdateContestResult = createAsyncThunk(
  "contest/addOrUpdateContestResult",
  async ({ contestId, resultData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        ` ${API_BASE_URL}/contests/${contestId}/results`,
        resultData
      );
      console.log("resultData: ", resultData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// get contest by student id
// Async thunk to get contests by student ID
export const getContestsByStudentId = createAsyncThunk(
    "contest/getContestsByStudentId",
    async (studentId, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/contests/student/${studentId}`
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

  const contestSlice = createSlice({
    name: "contest",
    initialState: {
      contests: [],
      contest: null,
      contestResults: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Create a contest
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
          state.error = action.payload || action.error.message;
        })
        // Get all contests
        .addCase(getContests.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getContests.fulfilled, (state, action) => {
          state.contests = action.payload;
          state.loading = false;
        })
        .addCase(getContests.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        // Get contest by ID
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
          state.error = action.payload || action.error.message;
        })
        // Update a contest
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
          state.error = action.payload || action.error.message;
        })
        // Delete a contest
        .addCase(deleteContest.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteContest.fulfilled, (state, action) => {
          state.contests = state.contests.filter(
            (contest) => contest.id !== action.meta.arg
          );
          state.loading = false;
        })
        .addCase(deleteContest.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        // Get contest results
        .addCase(getContestResults.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getContestResults.fulfilled, (state, action) => {
          state.contestResults = action.payload;
          state.loading = false;
        })
        .addCase(getContestResults.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        // Get student result
        .addCase(getStudentResult.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getStudentResult.fulfilled, (state, action) => {
          state.selectedContest = {
            ...state.selectedContest,
            studentResult: action.payload,
          };
          state.loading = false;
        })
        .addCase(getStudentResult.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        // Add or update contest result
        .addCase(addOrUpdateContestResult.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addOrUpdateContestResult.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(addOrUpdateContestResult.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        // Get contests by student ID
        .addCase(getContestsByStudentId.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getContestsByStudentId.fulfilled, (state, action) => {
          state.contests = action.payload;
          state.loading = false;
        })
        .addCase(getContestsByStudentId.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        });
    },
  });
  
  export const contestApiReducer = contestSlice.reducer;
  
