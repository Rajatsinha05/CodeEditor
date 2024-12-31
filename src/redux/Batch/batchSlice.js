import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Helper function for error handling
const handleApiError = (error, rejectWithValue) =>
  rejectWithValue(error.response?.data || "An error occurred");

// Async Thunks

// Fetch all ACTIVE batches
export const fetchAllActiveBatches = createAsyncThunk(
  "batch/fetchAllActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/batches");

      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Fetch batch by ID
export const fetchBatchById = createAsyncThunk(
  "batch/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/batches/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Save a new batch
export const saveBatch = createAsyncThunk(
  "batch/save",
  async (batchDTO, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/batches", batchDTO);
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Update an existing batch
export const updateBatch = createAsyncThunk(
  "batch/update",
  async (payload, { rejectWithValue }) => {
    console.log("payload: ", payload);

    try {
      const response = await axiosInstance.put(
        `/api/v1/batches/${payload.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      // Handle API errors (ensure `handleApiError` is implemented)
      return rejectWithValue(error.response?.data || "Unknown error occurred");
    }
  }
);

// Delete (Soft delete by marking as INACTIVE) a batch
export const deleteBatch = createAsyncThunk(
  "batch/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/batches/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// fetchBatchesByUserId
export const fetchBatchesByUserId = createAsyncThunk(
  "batch/fetchByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/batches/user/${userId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);
export const fetchBatchesByStudentId = createAsyncThunk(
  "batch/fetchByStudentId",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/batches/student/${studentId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, rejectWithValue);
    }
  }
);

// Initial State
const initialState = {
  allActiveBatches: [],
  selectedBatch: null,
  loading: false,
  error: null,
  isFetched: false,
};

// Slice
const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Active Batches Reducers
      .addCase(fetchAllActiveBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllActiveBatches.fulfilled, (state, action) => {
        state.allActiveBatches = action.payload;
        state.loading = false;
        state.isFetched = true;
      })
      .addCase(fetchAllActiveBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Batch by ID Reducers
      .addCase(fetchBatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchById.fulfilled, (state, action) => {
        state.selectedBatch = action.payload;
        state.loading = false;
      })
      .addCase(fetchBatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save Batch Reducers
      .addCase(saveBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBatch.fulfilled, (state, action) => {
        state.allActiveBatches.push(action.payload);
        state.loading = false;
      })
      .addCase(saveBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Batch Reducers
      .addCase(updateBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        state.allActiveBatches = state.allActiveBatches.map((batch) =>
          batch.id === action.payload.id ? action.payload : batch
        );
        state.loading = false;
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Batch Reducers
      .addCase(deleteBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.allActiveBatches = state.allActiveBatches.filter(
          (batch) => batch.id !== action.payload.id
        );
        state.loading = false;
      })
      .addCase(deleteBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBatchesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchesByUserId.fulfilled, (state, action) => {
        state.allActiveBatches = action.payload;
        state.loading = false;
        state.isFetched = true;
      })
      .addCase(fetchBatchesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Batches by Student ID Reducers
      .addCase(fetchBatchesByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchesByStudentId.fulfilled, (state, action) => {
        state.allActiveBatches = action.payload;
        state.loading = false;
        state.isFetched = true;
      })
      .addCase(fetchBatchesByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Reducer export
export const batchReducer = batchSlice.reducer;
