import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Fetch all experience records
export const fetchExperience = createAsyncThunk(
  "experience/fetchExperience",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/experiences");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch experience records."
      );
    }
  }
);

// Fetch an experience record by ID
export const fetchExperienceById = createAsyncThunk(
  "experience/fetchExperienceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/experiences/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          `Failed to fetch experience record with ID: ${id}.`
      );
    }
  }
);

// Create a new experience record
export const createExperience = createAsyncThunk(
  "experience/createExperience",
  async (experience, { rejectWithValue }) => {
    console.log("experience: ", experience);
    try {
      const response = await axiosInstance.post(
        "/api/v1/experiences",
        experience
      );
      console.log("response: ", response);

      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(error || "Failed to create experience record.");
    }
  }
);

// Update an existing experience record
export const updateExperience = createAsyncThunk(
  "experience/updateExperience",
  async ({ id, updates }, { rejectWithValue }) => {
    console.log("id, updates: ", id, updates);
    try {
      const response = await axiosInstance.put(
        `/api/v1/experiences/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          `Failed to update experience record with ID: ${id}.`
      );
    }
  }
);

// Delete an experience record
export const deleteExperience = createAsyncThunk(
  "experience/deleteExperience",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/experiences/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          `Failed to delete experience record with ID: ${id}.`
      );
    }
  }
);
