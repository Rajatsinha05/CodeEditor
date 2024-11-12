// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { createUser, deleteUser, fetchUsers, updateUser } from "./userApi";
import { stringToObject } from "../apiSlice";

// Initial State
const initialState = {
  loading: false,
  user: Cookies.get("userToken")
    ? stringToObject(Cookies.get("userToken"))
    : null,
  users: [],
  isLogin: !!Cookies.get("token"),
  token: Cookies.get("token") || null,
  error: null,
};

// Redux Slice for managing user-related API state
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      try {
        Cookies.remove("token");
        Cookies.remove("userToken");
      } catch (error) {
        console.error("Error during logout:", error);
      }
      state.user = null;
      state.isLogin = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Helper functions for managing states
    const setLoadingState = (state) => {
      state.loading = true;
      state.error = null;
    };

    const setErrorState = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Fetch Users
      .addCase(fetchUsers.pending, setLoadingState)
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, setErrorState)

      // Create User
      .addCase(createUser.pending, setLoadingState)
      .addCase(createUser.fulfilled, (state, action) => {
        // Assuming the API returns the created user data
        state.users.push(action.payload);
        state.loading = false;
      })
      .addCase(createUser.rejected, setErrorState)

      // Update User
      .addCase(updateUser.pending, setLoadingState)
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        state.loading = false;
      })
      .addCase(updateUser.rejected, setErrorState)

      // Delete User
      .addCase(deleteUser.pending, setLoadingState)
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteUser.rejected, setErrorState);
  },
});

export const { logoutUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
