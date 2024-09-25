import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import { apiReducer } from "./apiSlice";
import { contestReducer } from "./contestSlice";
import { contestApiReducer } from "./contestapislice";

// Configure the store with the different reducers
export const store = configureStore({
  reducer: {
    editor: editorReducer,    // Handles the state for the editor
    data: apiReducer,         // Handles API-related state
    contest: contestReducer,  // Handles contests state
    contestApi:contestApiReducer
  },
 
});
