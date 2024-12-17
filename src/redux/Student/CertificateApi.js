import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Fetch all certificates
export const fetchCertificates = createAsyncThunk(
  "certificates/fetchCertificates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/certificates");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch certificates."
      );
    }
  }
);

// Fetch certificate by ID
export const fetchCertificateById = createAsyncThunk(
  "certificates/fetchCertificateById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/certificates/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to fetch certificate with ID: ${id}.`
      );
    }
  }
);

// Create a new certificate
export const createCertificate = createAsyncThunk(
  "certificates/createCertificate",
  async (certificate, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/certificates",
        certificate
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create certificate."
      );
    }
  }
);

// Update an existing certificate
export const updateCertificate = createAsyncThunk(
  "certificates/updateCertificate",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/certificates/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to update certificate with ID: ${id}.`
      );
    }
  }
);

// Delete a certificate
export const deleteCertificate = createAsyncThunk(
  "certificates/deleteCertificate",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/certificates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to delete certificate with ID: ${id}.`
      );
    }
  }
);
