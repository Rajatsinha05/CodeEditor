import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Helper to create async thunks
const createAsyncThunkHelper = (name, apiCall, transformResponse) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try {
      const response = await apiCall(arg);
      return transformResponse
        ? transformResponse(response.data)
        : response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  });

// Thunks for TestDetail
export const fetchAllTestDetails = createAsyncThunkHelper(
  "testDetail/fetchAll",
  () => axiosInstance.get("/api/cy-projects")
);

export const fetchAllTestDetailsByBatchId = createAsyncThunkHelper(
  "testDetail/fetchByBatchId",
  (id) => axiosInstance.get(`/api/cy-projects/batch/${id}`)
);

export const fetchTestDetailById = createAsyncThunkHelper(
  "testDetail/fetchById",
  (id) => axiosInstance.get(`/api/cy-projects/${id}`)
);

export const createTestDetail = createAsyncThunkHelper(
  "testDetail/create",
  (testDetail) => axiosInstance.post("/api/cy-projects", testDetail)
);

export const updateTestDetail = createAsyncThunkHelper(
  "testDetail/update",
  ({ id, testDetail }) =>
    axiosInstance.put(`/api/cy-projects/${id}`, testDetail)
);

export const deleteTestDetail = createAsyncThunkHelper(
  "testDetail/delete",
  (id) => axiosInstance.delete(`/api/cy-projects/${id}`)
);

export const fetchTestDetailsByModule = createAsyncThunkHelper(
  "testDetail/fetchByModule",
  (module) => axiosInstance.get(`/api/cy-projects/filter?module=${module}`)
);

export const fetchResultsByFilters = createAsyncThunkHelper(
  "testDetail/fetchResultsByFilters",
  ({ studentId, cyProjectId }) => {
    const params = new URLSearchParams();
    if (studentId) params.append("studentId", studentId);
    if (cyProjectId) params.append("cyProjectId", cyProjectId);

    return axiosInstance.get(
      `/api/sandbox/results/filter?${params.toString()}`
    );
  }
);

export const fetchAllResults = createAsyncThunk(
  "results/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/sandbox/results");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  }
);
// Thunks for CyProject
export const fetchAllCyProjects = createAsyncThunkHelper(
  "cyProject/fetchAll",
  () => axiosInstance.get("/api/cy-projects")
);

export const fetchCyProjectById = createAsyncThunkHelper(
  "cyProject/fetchById",
  (id) => axiosInstance.get(`/api/cy-projects/${id}`)
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

// Initial state
const initialState = {
  loading: false,
  cyProjects: [],
  cyProject: null,
  testDetails: [],
  testDetail: null,
  results: [],
  error: null,
};

// Slice for TestDetail and CyProject
const testDetailSlice = createSlice({
  name: "project",
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
      // TestDetail Thunks
      .addCase(fetchAllTestDetails.pending, setLoadingState)
      .addCase(fetchAllTestDetails.fulfilled, (state, action) =>
        setSuccessState(state, action, "testDetails")
      )
      .addCase(fetchAllTestDetails.rejected, setErrorState)
      .addCase(fetchAllTestDetailsByBatchId.pending, setLoadingState)
      .addCase(fetchAllTestDetailsByBatchId.fulfilled, (state, action) =>
        setSuccessState(state, action, "testDetails")
      )
      .addCase(fetchAllTestDetailsByBatchId.rejected, setErrorState)
      .addCase(fetchTestDetailById.pending, setLoadingState)
      .addCase(fetchTestDetailById.fulfilled, (state, action) =>
        setSuccessState(state, action, "testDetail")
      )
      .addCase(fetchTestDetailById.rejected, setErrorState)
      .addCase(createTestDetail.pending, setLoadingState)
      .addCase(createTestDetail.fulfilled, (state, action) => {
        state.testDetails.push(action.payload);
        state.loading = false;
      })
      .addCase(createTestDetail.rejected, setErrorState)
      .addCase(updateTestDetail.pending, setLoadingState)
      .addCase(updateTestDetail.fulfilled, (state, action) => {
        const updatedDetail = action.payload;
        const index = state.testDetails.findIndex(
          (detail) => detail.id === updatedDetail.id
        );
        if (index !== -1) state.testDetails[index] = updatedDetail;
        state.loading = false;
      })
      .addCase(updateTestDetail.rejected, setErrorState)
      .addCase(deleteTestDetail.pending, setLoadingState)
      .addCase(deleteTestDetail.fulfilled, (state, action) => {
        state.testDetails = state.testDetails.filter(
          (detail) => detail.id !== action.meta.arg
        );
        state.loading = false;
      })
      .addCase(deleteTestDetail.rejected, setErrorState)
      // CyProject Thunks
      .addCase(fetchAllCyProjects.pending, setLoadingState)
      .addCase(fetchAllCyProjects.fulfilled, (state, action) =>
        setSuccessState(state, action, "cyProjects")
      )
      .addCase(fetchAllCyProjects.rejected, setErrorState)
      .addCase(fetchCyProjectById.pending, setLoadingState)
      .addCase(fetchCyProjectById.fulfilled, (state, action) =>
        setSuccessState(state, action, "cyProject")
      )
      .addCase(fetchCyProjectById.rejected, setErrorState)
      .addCase(createCyProject.pending, setLoadingState)
      .addCase(createCyProject.fulfilled, (state, action) => {
        state.cyProjects.push(action.payload);
        state.loading = false;
      })
      .addCase(createCyProject.rejected, setErrorState)
      .addCase(updateCyProject.pending, setLoadingState)
      .addCase(updateCyProject.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        const index = state.cyProjects.findIndex(
          (project) => project.id === updatedProject.id
        );
        if (index !== -1) state.cyProjects[index] = updatedProject;
        state.loading = false;
      })
      .addCase(updateCyProject.rejected, setErrorState)
      .addCase(deleteCyProject.pending, setLoadingState)
      .addCase(deleteCyProject.fulfilled, (state, action) => {
        state.cyProjects = state.cyProjects.filter(
          (project) => project.id !== action.meta.arg
        );
        state.loading = false;
      })
      .addCase(fetchResultsByFilters.fulfilled, (state, action) =>
        setSuccessState(state, action, "results")
      )
      .addCase(fetchResultsByFilters.rejected, setErrorState)
      .addCase(fetchAllResults.pending, setLoadingState)
      .addCase(fetchAllResults.fulfilled, (state, action) =>
        setSuccessState(state, action, "results")
      )
      .addCase(fetchAllResults.rejected, setErrorState);
  },
});

export const { resetError } = testDetailSlice.actions;
export const testDetailReducer = testDetailSlice.reducer;
