import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "../config/axiosConfig";
import {jwtDecode} from "jwt-decode"; // Fixed import
import { stringToObject } from "../utils/objectConveter"; // Assuming you have this utility

// Helper to create async thunks
const createAsyncThunkHelper = (name, apiCall, transformResponse) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try {
      const response = await apiCall(arg);
      return transformResponse
        ? transformResponse(response.data)
        : response.data;
    } catch (error) {
      
      return rejectWithValue(error.response?.data || "An error occurred.");
    }
  });

// Thunks
export const getUsers = createAsyncThunkHelper("api/getUsers", () =>
  axiosInstance.get("/users")
);

export const login = createAsyncThunkHelper(
  "api/login",
  (user) => axiosInstance.post("/users/login", user),
  (data) => {
    const { token, user: userDetailsToken } = data;
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("userToken", userDetailsToken, { expires: 7 });
    return { ...data, user: stringToObject(jwtDecode(userDetailsToken).sub) };
  }
);

export const getStudents = createAsyncThunkHelper("api/getStudents", () =>
  axiosInstance.get("/students")
);

export const getStudentById = createAsyncThunkHelper(
  "api/getStudentById",
  (id) => axiosInstance.get(`/students/${id}`)
);

export const createStudent = createAsyncThunkHelper(
  "api/createStudent",
  (student) => axiosInstance.post("/students", { ...student })
);

export const updateStudent = createAsyncThunkHelper(
  "api/updateStudent",
  ({ id, studentData }) => axiosInstance.put(`/students/${id}`, studentData)
);

export const deleteStudent = createAsyncThunkHelper(
  "api/deleteStudent",
  (id) => axiosInstance.delete(`/students/${id}`)
);

export const createStudentsFromFile = createAsyncThunkHelper(
  "api/createStudentsFromFile",
  (formData) =>
    axiosInstance.post("/students/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
);

export const createUser = createAsyncThunkHelper("api/createUser", (user) =>
  axiosInstance.post("/users/signup", { ...user })
);

// Initial state
const initialState = {
  loading: false,
  user: Cookies.get("userToken")
    ? stringToObject(jwtDecode(Cookies.get("userToken")).sub)
    : null,
  students: [],
  student: {},
  users: [],
  isLogin: !!Cookies.get("token"),
  token: Cookies.get("token") || null,
  error: null,
};

// API slice
const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("userToken");
      Cookies.remove("token");
      state.user = null;
      state.isLogin = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    const setLoadingState = (state) => {
      state.loading = true;
      state.error = null;
    };

    const setErrorState = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    const setSuccessState = (state, action, key) => {
      state[key] = action.payload;
      state.loading = false;
    };

    builder
      // Login
      .addCase(login.pending, setLoadingState)
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLogin = true;
        state.loading = false;
      })
      .addCase(login.rejected, setErrorState)

      // Get Users
      .addCase(getUsers.pending, setLoadingState)
      .addCase(getUsers.fulfilled, (state, action) =>
        setSuccessState(state, action, "users")
      )
      .addCase(getUsers.rejected, setErrorState)

      // Get Students
      .addCase(getStudents.pending, setLoadingState)
      .addCase(getStudents.fulfilled, (state, action) =>
        setSuccessState(state, action, "students")
      )
      .addCase(getStudents.rejected, setErrorState)

      // Get Student by ID
      .addCase(getStudentById.pending, setLoadingState)
      .addCase(getStudentById.fulfilled, (state, action) =>
        setSuccessState(state, action, "student")
      )
      .addCase(getStudentById.rejected, setErrorState)

      // Create Student
      .addCase(createStudent.pending, setLoadingState)
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
        state.loading = false;
      })
      .addCase(createStudent.rejected, setErrorState)

      // Update Student
      .addCase(updateStudent.pending, setLoadingState)
      .addCase(updateStudent.fulfilled, (state, action) => {
        const updatedStudent = action.payload;
        const index = state.students.findIndex(
          (student) => student.id === updatedStudent.id
        );
        if (index !== -1) {
          state.students[index] = updatedStudent;
        }
        state.loading = false;
      })
      .addCase(updateStudent.rejected, setErrorState)

      // Delete Student
      .addCase(deleteStudent.pending, setLoadingState)
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (student) => student.id !== action.payload.id
        );
        state.loading = false;
      })
      .addCase(deleteStudent.rejected, setErrorState)

      // Create Students from File
      .addCase(createStudentsFromFile.pending, setLoadingState)
      .addCase(createStudentsFromFile.fulfilled, setSuccessState)
      .addCase(createStudentsFromFile.rejected, setErrorState)

      // Create User
      .addCase(createUser.pending, setLoadingState)
      .addCase(createUser.fulfilled, setSuccessState)
      .addCase(createUser.rejected, setErrorState);
  },
});

export const { logout } = apiSlice.actions;
export const apiReducer = apiSlice.reducer;
