import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../config/axiosConfig";
import axios from "axios";


// Define an async thunk to post a question
export const postQuestion = createAsyncThunk(
  "api/postQuestion",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:7080/question", data);
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define an async thunk to get a question by id
export const getQuestionById = createAsyncThunk(
  "api/getQuestionById",
  async (questionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:7080/question/${questionId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define an async thunk to fetch questions
export const fetchQuestions = createAsyncThunk(
  "api/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:7080/question");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define an async thunk for login
export const login = createAsyncThunk(
  "api/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", user);

      const userDetailsToken = response.data.user;

      let token = response.data.token;
      // Set the JWT token in cookies
      Cookies.set("token", token, { expires: 7 }); // token expires in 1 day
      Cookies.set("userToken", userDetailsToken, { expires: 7 }); //
      // Decode the token to get user data
      let decoded = await jwtDecode(userDetailsToken);

      decoded = await stringToObject(decoded);
      return { ...response.data, user: decoded };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define async thunks for students
export const getStudents = createAsyncThunk(
  "api/getStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/students");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createStudent = createAsyncThunk(
  "api/createStudent",
  async (student, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/students", student);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Decode function
const stringToObject = (str) => {
  if (typeof str !== "string" || str.trim() === "") {
    return {};
  }

  const regex = /(\w+)=([^,]+)/g;
  const matches = str.match(regex);
  const obj = {};
  matches.forEach((match) => {
    const [key, value] = match.split("=");
    obj[key.trim()] = value.trim();
  });
  return obj;
  // return str;
};

// Define the initial state
const initialState = {
  questions: [],
  question: {},
  loading: false,
  user: Cookies.get("userToken")
    ? stringToObject(jwtDecode(Cookies.get("userToken"))?.sub)
    : null,
  students: [],
  isLogin: Cookies.get("token") ? true : false,
  token: Cookies.get("token") || null,
  error: null,
};

// Create a slice for the API state
const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    LoginManager: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      // Reducer for posting a question
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

      // Reducer for fetching a question by its ID
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

      // Reducer for fetching questions
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

      // Reducer for login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLogin = true;
        state.loading = false;
        window.location.reload();
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reducers for fetching students
      .addCase(getStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.students = action.payload;
        state.loading = false;
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reducers for creating a student
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
        state.loading = false;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const apiActions = apiSlice.actions;
export const apiReducer = apiSlice.reducer;
