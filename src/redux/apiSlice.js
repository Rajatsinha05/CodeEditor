import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
// Use require to import jwt-decode
import { jwtDecode } from "jwt-decode";

// Define an async thunk to post a question
export const postQuestion = createAsyncThunk(
  "api/postQuestion",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8090/questions",
        data
      );
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
        `http://localhost:8090/questions/${questionId}`
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
      const response = await axios.get("http://localhost:8090/questions");
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
      const response = await axios.post(
        "http://localhost:8090/users/login",
        user
      );
      const token = response.data.token;

      // Set the JWT token in cookies
      Cookies.set("token", token, { expires: 1 }); // token expires in 1 day

      // Decode the token to get user data
      const decoded = jwtDecode(token);

      return { ...response.data, user: decoded };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// decode.......
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
};

// Define the initial state
const initialState = {
  questions: [],
  question: {},
  loading: false,
  user: Cookies.get("token")
    ? stringToObject(jwtDecode(Cookies.get("token"))?.sub)
    : null,
  isLogin: !!Cookies.get("token"),
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
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const apiActions = apiSlice.actions;
export const apiReducer = apiSlice.reducer;
