import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/projects"); // Full API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch projects."
      );
    }
  }
);

// Fetch project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/projects/${id}`); // Full API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to fetch project with ID: ${id}.`
      );
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (project, { rejectWithValue }) => {
    console.log("project: ", project);
    try {
      const response = await axiosInstance.post("/api/v1/projects", project); // Full API endpoint
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(
        error.response?.data || "Failed to create project."
      );
    }
  }
);

// Update an existing project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/projects/${id}`,
        updates
      ); // Full API endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to update project with ID: ${id}.`
      );
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/projects/${id}`); // Full API endpoint
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to delete project with ID: ${id}.`
      );
    }
  }
);
