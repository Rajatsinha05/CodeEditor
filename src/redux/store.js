import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import { apiReducer } from "./apiSlice";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    data:apiReducer
  },
});
