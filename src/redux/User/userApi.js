// userApi.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

/**
 * Creates a reusable API thunk with consistent error handling.
 * @param {string} typePrefix - Name of the thunk action.
 * @param {function} apiFunction - The API function that returns a promise.
 * @returns {function} - A thunk action.
 */
const createApiThunk = (typePrefix, apiFunction) =>
  createAsyncThunk(typePrefix, async (args, { rejectWithValue }) => {
    try {
      const response = await apiFunction(args);
      return response.data;
    } catch (error) {
      console.error(`Error in ${typePrefix}:`, error.message);

      // Enhanced error handling
      let errorMessage = `An error occurred in ${typePrefix}.`;
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMessage = error.response.data?.message || error.response.data || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please try again later.";
      } else {
        // Something happened in setting up the request
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  });

// Fetch Users
export const fetchUsers = createApiThunk("user/fetchUsers", () =>
  axiosInstance.get("/users")
);

// Create User
export const createUser = createApiThunk("user/createUser", (user) => {
  user.role = "ADMIN"; // Ensure the role is set to ADMIN
  return axiosInstance.post("/users/signup", user);
});

// Update User
export const updateUser = createApiThunk("user/updateUser", ({ id, userData }) =>
  axiosInstance.put(`/users/${id}`, userData)
);

// Delete User
export const deleteUser = createApiThunk("user/deleteUser", (userId) =>
  axiosInstance.delete(`/users/${userId}`)
);
