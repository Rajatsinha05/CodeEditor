// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import {
  createUser,
  deleteUser,
  fetchUsers,
  fetchUsersByBranchCode,
  updateUser,
} from "./userApi";
import { login } from "../apiSlice";

import { jwtDecode } from "jwt-decode";
import { stringToObject } from "../../utils/objectConveter";

const initialState = {
  loading: false,
  user: Cookies.get("userToken")
    ? stringToObject(jwtDecode(Cookies.get("userToken")).sub)
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
      } catch (error) {}
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

      // fetch by branch code

      .addCase(fetchUsersByBranchCode.pending, setLoadingState)
      .addCase(fetchUsersByBranchCode.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsersByBranchCode.rejected, setErrorState)

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
      .addCase(deleteUser.rejected, setErrorState)
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logoutUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
