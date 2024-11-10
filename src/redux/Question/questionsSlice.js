import { createSlice } from "@reduxjs/toolkit";
import {
  postQuestion,
  getQuestionById,
  fetchQuestions,
  solvedQuestions,
} from "./questionApi";

// Initial state for the questions slice
const initialState = {
  questions: [],
  question: {},
  loading: false,
  error: null,
};

// Create the questions slice
const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
        state.loading = false;
      })
      .addCase(postQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestionById.fulfilled, (state, action) => {
        state.question = action.payload;
        state.loading = false;
      })
      .addCase(getQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(solvedQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(solvedQuestions.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(solvedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export const questionsReducer = questionsSlice.reducer;
