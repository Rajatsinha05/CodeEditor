import { createSlice } from "@reduxjs/toolkit";
import {
  postQuestion,
  getQuestionById,
  fetchQuestions,
  deleteQuestion,
  updateQuestion,
  fetchQuestionsWithFilters,
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

      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        // Update the question in the questions array
        const index = state.questions.findIndex(
          (question) => question.id === action.payload.id
        );
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
        // If the updated question is the currently selected question
        if (state.question?.id === action.payload.id) {
          state.question = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteQuestion actions
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the question from the questions array
        state.questions = state.questions.filter(
          (question) => question.id !== action.payload
        );
        // If the deleted question is the currently selected question
        if (state.question?.id === action.payload) {
          state.question = null;
        }
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuestionsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsWithFilters.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestionsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export const questionsReducer = questionsSlice.reducer;
