import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "../config/axiosConfig";

// Define an async thunk to post a question
export const postQuestion = createAsyncThunk(
  "api/postQuestion",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/questions", data);
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
      const response = await axiosInstance.get(`/questions/${questionId}`);
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
      const response = await axiosInstance.get("/questions");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// student questions solved successfully

// Define an async thunk to update solved questions for a student
export const solvedQuestions = createAsyncThunk(
  "api/solvedQuestions",
  async ({ questionId, studentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/students/${studentId}/solve/${questionId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      const { token, user: userDetailsToken } = response.data;

      // Set the JWT token in cookies
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("userToken", userDetailsToken, { expires: 7 });

      // Decode the token to get user data
      const decodedUser = stringToObject(userDetailsToken);

      return { ...response.data, user: decodedUser };
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
export const createUser = createAsyncThunk(
  "api/createUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/signup", user);
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

  const regex = /(\w+)=([^(,|\)]+)[,|\)]/g;
  const matches = [...str.matchAll(regex)];
  const obj = {};

  matches.forEach((match) => {
    const [_, key, value] = match;
    obj[key.trim()] = value.trim();
  });

  return obj;
};

// Define the initial state
const initialState = {
  questions: [],
  question: {},
  loading: false,
  user: Cookies.get("userToken")
    ? stringToObject(Cookies.get("userToken"))
    : null,
  students: [],
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
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(solvedQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(solvedQuestions.fulfilled, (state, action) => {
        const updatedStudent = action.payload;
        const studentIndex = state.students.findIndex(
          (student) => student.id === updatedStudent.id
        );
        if (studentIndex !== -1) {
          state.students[studentIndex] = updatedStudent;
        }
        state.loading = false;
      })
      .addCase(solvedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getsolvedQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getsolvedQuestions.fulfilled, (state, action) => {
        const solvedQuestionsData = action.payload;
        const studentIndex = state.students.findIndex(
          (student) => student.id === solvedQuestionsData.studentId
        );
        if (studentIndex !== -1) {
          state.students[studentIndex].solvedQuestions = solvedQuestionsData.solvedQuestions;
        }
        state.loading = false;
      })
      .addCase(getsolvedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const apiActions = apiSlice.actions;
export const apiReducer = apiSlice.reducer;
