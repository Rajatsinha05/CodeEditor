import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Async thunk to post a question
export const postQuestion = createAsyncThunk(
  "questions/postQuestion",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/questions", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while posting the question."
      );
    }
  }
);

// Async thunk to get a question by ID
export const getQuestionById = createAsyncThunk(
  "questions/getQuestionById",
  async (questionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/questions/${questionId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching the question."
      );
    }
  }
);

// Async thunk to fetch all questions
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/questions");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching questions."
      );
    }
  }
);

// Async thunk to fetch questions with filters
export const fetchQuestionsWithFilters = createAsyncThunk(
  "questions/fetchQuestionsWithFilters",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { module} = filters;

      // Construct query string
      const queryParams = new URLSearchParams();
      if (module) queryParams.append("module", module);

      const response = await axiosInstance.get(
        `/api/v1/questions/filter?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching questions."
      );
    }
  }
);

// Async thunk to update a question by ID
export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async ({ questionId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/questions/${questionId}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while updating the question."
      );
    }
  }
);

// Async thunk to delete a question by ID
export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (questionId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/questions/${questionId}`);
      return questionId; // Return the ID so we can remove it from the state
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while deleting the question."
      );
    }
  }
);
