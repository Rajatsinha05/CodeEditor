import { createSlice } from "@reduxjs/toolkit";
import { CODE_SNIPPETS } from "../constants";

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    value: CODE_SNIPPETS["javascript"],
    language: "javascript",
    theme: "vs-dark",
    fontSize: 14,
    isRecording: false,
    isCameraActive: true,
    inactiveTime: 0,
    tabChangeCount: 0,
    isScreenBlurred: false,
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    setIsCameraActive: (state, action) => {
      state.isCameraActive = action.payload;
    },
    setInactiveTime: (state, action) => {
      state.inactiveTime = action.payload;
    },
    setTabChangeCount: (state, action) => {
      state.tabChangeCount = action.payload;
    },
    setIsScreenBlurred: (state, action) => {
      state.isScreenBlurred = action.payload;
    },
  },
});

export const {
  setValue,
  setLanguage,
  setTheme,
  setFontSize,
  setIsRecording,
  setIsCameraActive,
  setInactiveTime,
  setTabChangeCount,
  setIsScreenBlurred,
} = editorSlice.actions;

export const selectEditor = (state) => state.editor;

export default editorSlice.reducer;
