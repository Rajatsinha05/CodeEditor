import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "../config/axiosConfig";
import { generateLongIdFromUUID } from "../utils/idHelper";
// Async thunk to get users
export const getUsers = createAsyncThunk(
  "api/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching users."
      );
    }
  }
);
// Async thunk to post a question
export const postQuestion = createAsyncThunk(
  "api/postQuestion",
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
  "api/getQuestionById",
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
  "api/fetchQuestions",
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
  "api/solvedQuestions",
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

// Async thunk to get solved questions for a student
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

// Async thunk for login
export const login = createAsyncThunk(
  "api/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", user);
      const { token, user: userDetailsToken } = response.data;
      console.log(" token, user: userDetailsToken: ", {
        token,
        user: userDetailsToken,
      });

      // Set the JWT token in cookies
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("userToken", userDetailsToken, { expires: 7 });

      // Parse the user details from the token using custom logic
      const decodedUser = stringToObject(userDetailsToken);
      console.log("decodedUser: ", decodedUser);
      console.log("userDetailsToken: ", userDetailsToken);

      return { ...response.data, user: decodedUser };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Login failed. Please check your credentials."
      );
    }
  }
);

// Async thunk for getting students
export const getStudents = createAsyncThunk(
  "api/getStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/students");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching students."
      );
    }
  }
);

// Async thunk for getting students

// Async thunk to create a new student
export const createStudent = createAsyncThunk(
  "api/createStudent",
  async (student, { rejectWithValue }) => {
    console.log("st", student, generateLongIdFromUUID());

    try {
      student.id = generateLongIdFromUUID();
      console.log("student: ", student);

      const response = await axiosInstance.post("/students", student);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while creating a student."
      );
    }
  }
);

// Async thunk to create students from a file (bulk upload)
export const createStudentsFromFile = createAsyncThunk(
  "api/createStudentsFromFile",
  async (formData, { rejectWithValue }) => {
    formData.id = generateLongIdFromUUID();
    try {
      const response = await axiosInstance.post("/students/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while uploading the file."
      );
    }
  }
);

// Async thunk to create a new user
export const createUser = createAsyncThunk(
  "api/createUser",
  async (user, { rejectWithValue }) => {
    console.log("user", user);
    try {
      user.id = generateLongIdFromUUID();
      const response = await axiosInstance.post("/users/signup", user);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while creating the user."
      );
    }
  }
);

// permission
// Async thunk to assign a permission to a user
export const assignPermission = createAsyncThunk(
  "api/assignPermission",
  async ({ userId, permissions }, { rejectWithValue }) => {
    console.log("userId, permissions: ", userId, permissions);

    try {
      const response = await axiosInstance.put(
        `/users/${userId}/permissions/add`,
        {
          permissions, // Send as an array
        }
      );

      console.log("res", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while assigning the permission."
      );
    }
  }
);

// Async thunk to revoke a permission from a user
export const revokePermission = createAsyncThunk(
  "api/revokePermission",
  async ({ userId, permission }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/users/${userId}/permissions/remove`,
        {
          permission,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while revoking the permission."
      );
    }
  }
);

// Custom function to parse non-standard format string into an object
const stringToObject = (str) => {
  if (typeof str !== "string" || str.trim() === "") {
    return {};
  }

  // Assuming input is in a format like: "Students(id=10, name=Student7, email=student10@example.com, ...)"
  const obj = {};

  // Regex to match key-value pairs in the format key=value, including values with spaces and symbols
  const keyValuePattern = /(\w+)=([^,]+)(?=,|$)/g;

  let match;
  while ((match = keyValuePattern.exec(str)) !== null) {
    const [_, key, value] = match;
    obj[key.trim()] = value.trim().replace(/\)$/, ""); // Remove any trailing ")" from values
  }

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
  users: [], // Add a new array for storing users
  isLogin: !!Cookies.get("token"),
  token: Cookies.get("token") || null,
  error: null,
};

// Create a slice for the API state
const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("token");
      Cookies.remove("userToken");
      state.user = null;
      state.isLogin = false;
      state.token = null;
    },
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

      // Reducer for creating a user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reducer for solving questions
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

      // Reducer for getting solved questions
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
          state.students[studentIndex].solvedQuestions =
            solvedQuestionsData.solvedQuestions || [];
        }
        state.loading = false;
      })
      .addCase(getsolvedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reducer for creating students from file
      .addCase(createStudentsFromFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudentsFromFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createStudentsFromFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload; // Update the users list in state
        state.loading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignPermission.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser; // Update user permissions
        }
        state.loading = false;
      })
      .addCase(assignPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle revoking a permission
      .addCase(revokePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revokePermission.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser; // Update user permissions
        }
        state.loading = false;
      })
      .addCase(revokePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions and reducer
export const { logout } = apiSlice.actions;
export const apiReducer = apiSlice.reducer;
