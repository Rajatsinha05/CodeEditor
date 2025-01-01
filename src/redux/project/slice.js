import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Helper to create async thunks
const createAsyncThunkHelper = (name, apiCall) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try {
      const response = await apiCall(arg);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  });

// TestDetail Thunks
export const fetchAllTestDetails = createAsyncThunkHelper(
  "testDetail/fetchAll",
  () => axiosInstance.get("/api/test-details")
);

export const fetchAllTestDetailsByBatchId = createAsyncThunkHelper(
  "testDetail/fetchByBatchId",
  (batchId) => axiosInstance.get(`/api/cy-projects/batch/${batchId}`)
);

export const fetchTestDetailById = createAsyncThunkHelper(
  "testDetail/fetchById",
  (id) => axiosInstance.get(`/api/cy-projects/${id}`)
);

export const createTestDetail = createAsyncThunkHelper(
  "testDetail/create",
  (testDetail) => axiosInstance.post("/api/test-details", testDetail)
);

export const updateTestDetail = createAsyncThunkHelper(
  "testDetail/update",
  ({ id, testDetail }) =>
    axiosInstance.put(`/api/test-details/${id}`, testDetail)
);

export const deleteTestDetail = createAsyncThunkHelper(
  "testDetail/delete",
  (id) => axiosInstance.delete(`/api/test-details/${id}`)
);
export const fetchTestDetailsByModule = createAsyncThunkHelper(
  "testDetail/fetchByModule",
  (module) => axiosInstance.get(`/api/test-details/filter?module=${module}`)
);

// CyProject Thunks
export const fetchAllCyProjects = createAsyncThunkHelper(
  "cyProject/fetchAll",
  () => axiosInstance.get("/api/cy-projects")
);

export const createCyProject = createAsyncThunkHelper(
  "cyProject/create",
  (cyProject) => axiosInstance.post("/api/cy-projects", cyProject)
);

export const updateCyProject = createAsyncThunkHelper(
  "cyProject/update",
  ({ id, cyProject }) => axiosInstance.put(`/api/cy-projects/${id}`, cyProject)
);

export const deleteCyProject = createAsyncThunkHelper(
  "cyProject/delete",
  (id) => axiosInstance.delete(`/api/cy-projects/${id}`)
);

// Results Thunks
export const fetchAllResults = createAsyncThunkHelper("results/fetchAll", () =>
  axiosInstance.get("/api/sandbox/results")
);

export const fetchResultsByFilters = createAsyncThunkHelper(
  "results/fetchByFilters",
  ({ studentId, cyProjectId }) => {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId);
    if (cyProjectId) params.append("cyProjectId", cyProjectId);

    return axiosInstance.get(
      `/api/sandbox/results/filter?${params.toString()}`
    );
  }
);

export const fetchResultById = createAsyncThunkHelper(
  "results/fetchById",
  (id) => axiosInstance.get(`/api/sandbox/results/${id}`)
);

export const createResult = createAsyncThunkHelper("results/create", (result) =>
  axiosInstance.post("/api/sandbox/results", result)
);

export const updateResult = createAsyncThunkHelper(
  "results/update",
  ({ id, result }) => axiosInstance.put(`/api/sandbox/results/${id}`, result)
);

export const deleteResult = createAsyncThunkHelper("results/delete", (id) =>
  axiosInstance.delete(`/api/sandbox/results/${id}`)
);

// Initial State
const initialState = {
  loading: false,
  testDetails: [],
  testDetail: null,
  cyProjects: [],
  cyProject: null,
  results: [],
  result: null,
  error: null,
};

// Slice
const testDetailSlice = createSlice({
  name: "testDetail",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setLoadingState = (state) => {
      state.loading = true;
      state.error = null;
    };

    const setErrorState = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    const setSuccessState = (state, action, key) => {
      state[key] = action.payload;
      state.loading = false;
    };

    builder
      // TestDetails
      .addCase(fetchAllTestDetails.pending, setLoadingState)
      .addCase(fetchAllTestDetails.fulfilled, (state, action) => {
        state.testDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllTestDetails.rejected, setErrorState)
      .addCase(fetchAllTestDetailsByBatchId.pending, setLoadingState)
      .addCase(fetchAllTestDetailsByBatchId.fulfilled, (state, action) => {
        state.testDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllTestDetailsByBatchId.rejected, setErrorState)
      .addCase(fetchTestDetailById.fulfilled, (state, action) => {
        state.testDetail = action.payload;
        state.loading = false;
      })
      .addCase(createTestDetail.fulfilled, (state, action) => {
        state.testDetails.push(action.payload);
        state.loading = false;
      })
      .addCase(updateTestDetail.fulfilled, (state, action) => {
        const index = state.testDetails.findIndex(
          (detail) => detail.id === action.payload.id
        );
        if (index !== -1) state.testDetails[index] = action.payload;
        state.loading = false;
      })
      .addCase(deleteTestDetail.fulfilled, (state, action) => {
        state.testDetails = state.testDetails.filter(
          (detail) => detail.id !== action.payload.id
        );
        state.loading = false;
      })
      .addCase(fetchTestDetailsByModule.pending, setLoadingState)
      .addCase(fetchTestDetailsByModule.fulfilled, (state, action) => {
        state.testDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchTestDetailsByModule.rejected, setErrorState)

      // CyProjects
      .addCase(fetchAllCyProjects.pending, setLoadingState)
      .addCase(fetchAllCyProjects.fulfilled, (state, action) => {
        state.cyProjects = action.payload;
        state.loading = false;
      })
      .addCase(createCyProject.fulfilled, (state, action) => {
        state.cyProjects.push(action.payload);
        state.loading = false;
      })
      .addCase(deleteCyProject.fulfilled, (state, action) => {
        state.cyProjects = state.cyProjects.filter(
          (project) => project.id !== action.payload.id
        );
        state.loading = false;
      })

      // Results
      .addCase(fetchAllResults.pending, setLoadingState)
      .addCase(fetchAllResults.fulfilled, (state, action) => {
        state.results = action.payload;
        state.loading = false;
      })
      .addCase(fetchResultById.fulfilled, (state, action) => {
        state.result = action.payload;
        state.loading = false;
      })
      .addCase(createResult.fulfilled, (state, action) => {
        state.results.push(action.payload);
        state.loading = false;
      })
      .addCase(updateResult.fulfilled, (state, action) => {
        const index = state.results.findIndex(
          (result) => result.id === action.payload.id
        );
        if (index !== -1) state.results[index] = action.payload;
        state.loading = false;
      })
      .addCase(deleteResult.fulfilled, (state, action) => {
        state.results = state.results.filter(
          (result) => result.id !== action.payload.id
        );
        state.loading = false;
      });
  },
});

export const { resetError } = testDetailSlice.actions;
export const testDetailReducer = testDetailSlice.reducer;
