import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";

// Create the async thunk for creating a contest
const createContest = createAsyncThunk("/contest", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/contests", data);
    console.log('response.data: ', response.data);
    return response.data;
    
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create the async thunk for getting contests
const getContest = createAsyncThunk("/contests", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/contests");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Initial state for the contest slice
const initialState = {
  contest: [],
  isLoading: false,
  error: null,
};

// Create the contest slice
const contestSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle createContest actions
      .addCase(createContest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contest.push(action.payload);
        state.error = null;
      })
      .addCase(createContest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle getContest actions
      .addCase(getContest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contest = action.payload;
        state.error = null;
      })
      .addCase(getContest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export the async thunks and reducer
export { createContest, getContest };
export default contestSlice.reducer;
