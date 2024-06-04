import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define an async thunk to post a question
export const postQuestion = createAsyncThunk(
  "api/postQuestion",
  async (data) => {
    const response = await axios.post("http://localhost:8090/questions", data);

    return response.data;
  }
);
// getting the question by id
export const getQuestionById = createAsyncThunk(
  "api/getQuestionById",
  async (questionId) => {
    const response = await axios.get(
      `http://localhost:8090/questions/${questionId}`
    );
    return response.data;
  }
);
// Define an async thunk to fetch questions
export const fetchQuestions = createAsyncThunk(
  "api/fetchQuestions",
  async () => {
    const response = await axios.get("http://localhost:8090/questions");
    return response.data;
  }
);

// Define the initial state
const initialState = {
  questions: [],
  question: {},
  loading: false,
};

// Create a slice for the API state
const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducer for posting a question
      .addCase(postQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(postQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
        state.loading = false;
      })
      .addCase(postQuestion.rejected, (state) => {
        state.loading = false;
      })

      // Reducer for fetching a question by its ID
      .addCase(getQuestionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuestionById.fulfilled, (state, action) => {
        state.question = action.payload;
        state.loading = false;
      })
      .addCase(getQuestionById.rejected, (state) => {
        state.loading = false;
      })

      // Reducer for fetching questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        console.log(action.payload);
        state.questions = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestions.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Export the actions and reducer
export const apiActions = apiSlice.actions;
export const apiReducer = apiSlice.reducer;
