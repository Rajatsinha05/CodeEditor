import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../config/axiosConfig";
import { generateLongIdFromUUID } from "../../utils/idHelper";

// Async thunk to post a question
export const postQuestion = createAsyncThunk(
  "questions/postQuestion",
  async (data, { rejectWithValue }) => {
    try {
      data.id = generateLongIdFromUUID();
      const response = await axiosInstance.post("/questions", data);
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
      const response = await axiosInstance.get(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching the question."
      );
    }
  }
);

// Async thunk to fetch questions
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/questions");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching questions."
      );
    }
  }
);

// Async thunk to update solved questions for a student
export const solvedQuestions = createAsyncThunk(
  "questions/solvedQuestions",
  async ({ questionId, studentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/students/${studentId}/solve/${questionId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while updating solved questions."
      );
    }
  }
);
export const getsolvedQuestions = createAsyncThunk(
  "api/getsolvedQuestions",
  async ({ studentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/students/${studentId}/solved-questions`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching solved questions."
      );
    }
  }
);
