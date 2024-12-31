// src/redux/theme/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light", // Default to 'light' mode
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    initializeTheme: (state) => {
      if (typeof window !== "undefined") {
        // Check for window object (important for SSR)
        const savedMode = localStorage.getItem("themeMode");
        if (savedMode) {
          state.mode = savedMode;
        } else {
          const prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          state.mode = prefersDarkMode ? "dark" : "light";
        }
      } else {
        // Default to 'light' mode if window is not available
        state.mode = "light";
      }
    },
    toggleThemeMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("themeMode", state.mode);
      }
    },
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("themeMode", state.mode);
      }
    },
  },
});

export const { initializeTheme, toggleThemeMode, setThemeMode } =
  themeSlice.actions;

export const themeReducer = themeSlice.reducer;
