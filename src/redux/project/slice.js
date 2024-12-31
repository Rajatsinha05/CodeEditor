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
  () => axiosInstance.get("/api/test-details")
);

export const fetchTestDetailById = createAsyncThunkHelper(
  "testDetail/fetchById",
  (id) => axiosInstance.get(`/api/test-details/${id}`)
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

// projects

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

// Slice for TestDetail
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
      // Fetch All Test Details
      .addCase(fetchAllTestDetails.pending, setLoadingState)
      .addCase(fetchAllTestDetails.fulfilled, (state, action) =>
        setSuccessState(state, action, "testDetails")
      )
      .addCase(fetchAllTestDetails.rejected, setErrorState)

      // Fetch Test Detail by ID
      .addCase(fetchTestDetailById.pending, setLoadingState)
      .addCase(fetchTestDetailById.fulfilled, (state, action) =>
        setSuccessState(state, action, "testDetail")
      )
      .addCase(fetchTestDetailById.rejected, setErrorState)

      // Create Test Detail
      .addCase(createTestDetail.pending, setLoadingState)
      .addCase(createTestDetail.fulfilled, (state, action) => {
        state.testDetails.push(action.payload);
        state.loading = false;
      })
      .addCase(createTestDetail.rejected, setErrorState)

      // Update Test Detail
      .addCase(updateTestDetail.pending, setLoadingState)
      .addCase(updateTestDetail.fulfilled, (state, action) => {
        const updatedDetail = action.payload;
        const index = state.testDetails.findIndex(
          (detail) => detail.id === updatedDetail.id
        );
        if (index !== -1) {
          state.testDetails[index] = updatedDetail;
        }
        state.loading = false;
      })
      .addCase(updateTestDetail.rejected, setErrorState)

      // Delete Test Detail
      .addCase(deleteTestDetail.pending, setLoadingState)
      .addCase(deleteTestDetail.fulfilled, (state, action) => {
        state.testDetails = state.testDetails.filter(
          (detail) => detail.id !== action.meta.arg
        );
        state.loading = false;
      })
      .addCase(deleteTestDetail.rejected, setErrorState)

      // Fetch Test Details by Module
      .addCase(fetchTestDetailsByModule.pending, setLoadingState)
      .addCase(fetchTestDetailsByModule.fulfilled, (state, action) =>
        setSuccessState(state, action, "testDetails")
      )
      .addCase(fetchTestDetailsByModule.rejected, setErrorState)

      .addCase(fetchResultsByFilters.pending, setLoadingState)
      .addCase(fetchResultsByFilters.fulfilled, (state, action) =>
        setSuccessState(state, action, "results")
      )
      .addCase(fetchResultsByFilters.rejected, setErrorState)

      // projects
      .addCase(fetchAllCyProjects.pending, setLoadingState)
      .addCase(fetchAllCyProjects.fulfilled, (state, action) =>
        setSuccessState(state, action, "cyProjects")
      )
      .addCase(fetchAllCyProjects.rejected, setErrorState)

      // Fetch CyProject by ID
      .addCase(fetchCyProjectById.pending, setLoadingState)
      .addCase(fetchCyProjectById.fulfilled, (state, action) =>
        setSuccessState(state, action, "cyProject")
      )
      .addCase(fetchCyProjectById.rejected, setErrorState)

      // Create CyProject
      .addCase(createCyProject.pending, setLoadingState)
      .addCase(createCyProject.fulfilled, (state, action) => {
        state.cyProjects.push(action.payload);
        state.loading = false;
      })
      .addCase(createCyProject.rejected, setErrorState)

      // Update CyProject
      .addCase(updateCyProject.pending, setLoadingState)
      .addCase(updateCyProject.fulfilled, (state, action) => {
        const updatedProject = action.payload;
        const index = state.cyProjects.findIndex(
          (project) => project.id === updatedProject.id
        );
        if (index !== -1) {
          state.cyProjects[index] = updatedProject;
        }
        state.loading = false;
      })
      .addCase(updateCyProject.rejected, setErrorState)

      // Delete CyProject
      .addCase(deleteCyProject.pending, setLoadingState)
      .addCase(deleteCyProject.fulfilled, (state, action) => {
        state.cyProjects = state.cyProjects.filter(
          (project) => project.id !== action.meta.arg
        );
        state.loading = false;
      })
      .addCase(deleteCyProject.rejected, setErrorState);
  },
});

export const { resetError } = testDetailSlice.actions;
export const testDetailReducer = testDetailSlice.reducer;
