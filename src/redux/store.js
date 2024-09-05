import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import { apiReducer } from "./apiSlice";
import {contestSlice} from "./contestSlice";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    data:apiReducer,
    contest:contestSlice,

  },
});
