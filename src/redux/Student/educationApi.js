import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Fetch all education records
export const fetchEducation = createAsyncThunk(
  "education/fetchEducation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/education");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch education records."
      );
    }
  }
);

// Fetch education record by ID
export const fetchEducationById = createAsyncThunk(
  "education/fetchEducationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/education/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          `Failed to fetch education record with ID: ${id}.`
      );
    }
  }
);

// Create a new education record
export const createEducation = createAsyncThunk(
  "education/createEducation",
  async (education, { rejectWithValue }) => {
    console.log("education: ", education);
    try {
      const response = await axiosInstance.post("/api/v1/education", education);
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue(
        error.response?.data || "Failed to create education record."
      );
    }
  }
);

// Update an existing education record
export const updateEducation = createAsyncThunk(
  "education/updateEducation",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/education/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          `Failed to update education record with ID: ${id}.`
      );
    }
  }
);

// Delete an education record
export const deleteEducation = createAsyncThunk(
  "education/deleteEducation",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/education/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          `Failed to delete education record with ID: ${id}.`
      );
    }
  }
);
