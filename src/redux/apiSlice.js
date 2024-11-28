import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "../config/axiosConfig";
import { generateLongIdFromUUID } from "../utils/idHelper";

export const stringToObject = (str) => {
  if (typeof str !== "string" || str.trim() === "") return {};
  const obj = {};
  const keyValuePattern = /\b(\w+)=([^,]+)(?=,|$)/g;
  let match;
  while ((match = keyValuePattern.exec(str)) !== null) {
    let key = match[1].trim();
    let value = match[2].trim().replace(/\)$/, ""); // Remove trailing parentheses
    // Manually fix the role field if it ends with '}'
    if (key === "role" && value.endsWith("}")) {
      value = value.slice(0, -1); // Remove the trailing '}'
    }
    obj[key] = value;
  }
  return obj;
};

const createAsyncThunkHelper = (name, apiCall, transformResponse) =>
  createAsyncThunk(name, async (arg, { rejectWithValue }) => {
    try {
      const response = await apiCall(arg);
      return transformResponse
        ? transformResponse(response.data)
        : response.data;
    } catch (error) {
      try {
        console.error(`Error in ${name}:`, error);
      } catch (consoleError) {
        console.error("Error logging failed:", consoleError);
      }
      return rejectWithValue(
        error.response?.data || `An error occurred while processing ${name}.`
      );
    }
  });

export const getUsers = createAsyncThunkHelper("api/getUsers", () =>
  axiosInstance.get("/users")
);

export const login = createAsyncThunkHelper(
  "api/login",
  (user) => axiosInstance.post("/users/login", user),
  (data) => {
    try {
      const { token, user: userDetailsToken } = data;
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("userToken", userDetailsToken, { expires: 7 });
      return { ...data, user: stringToObject(userDetailsToken) };
    } catch (error) {
      console.error("Error processing login response:", error);
      throw error;
    }
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
  (student) => {
    try {
      const studentWithId = { ...student, id: generateLongIdFromUUID() };
      return axiosInstance.post("/students", studentWithId);
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }
);

export const createStudentsFromFile = createAsyncThunkHelper(
  "api/createStudentsFromFile",
  (formData) => {
    try {
      return axiosInstance.post("/students/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error uploading students file:", error);
      throw error;
    }
  }
);

export const createUser = createAsyncThunkHelper("api/createUser", (user) => {
  try {
    const userWithId = { ...user, id: generateLongIdFromUUID() };
    return axiosInstance.post("/users/signup", userWithId);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
});

const initialState = {
  loading: false,
  user: Cookies.get("userToken")
    ? stringToObject(Cookies.get("userToken"))
    : null,
  students: [],
  student: {},
  users: [],
  isLogin: !!Cookies.get("token"),
  token: Cookies.get("token") || null,
  error: null,
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    logout: (state) => {
      try {
        Cookies.remove("userToken");
        Cookies.remove("token");

        // window.location.reload();
      } catch (error) {
        console.error("Error during logout:", error);
      }
      state.user = null;
      state.isLogin = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (state, action, prop) => {
      state[prop] = action.payload;
      state.loading = false;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLogin = true;
        state.loading = false;
        // window.location.reload();
      })
      .addCase(login.rejected, handleRejected)
      .addCase(getStudents.pending, handlePending)
      .addCase(getStudents.fulfilled, (state, action) =>
        handleFulfilled(state, action, "students")
      )
      .addCase(getStudents.rejected, handleRejected)
      .addCase(createStudent.pending, handlePending)
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
        state.loading = false;
      })
      .addCase(createStudent.rejected, handleRejected)
      .addCase(createUser.pending, handlePending)
      .addCase(createUser.fulfilled, handleFulfilled)
      .addCase(createUser.rejected, handleRejected)
      .addCase(createStudentsFromFile.pending, handlePending)
      .addCase(createStudentsFromFile.fulfilled, handleFulfilled)
      .addCase(createStudentsFromFile.rejected, handleRejected)
      .addCase(getUsers.pending, handlePending)
      .addCase(getUsers.fulfilled, (state, action) =>
        handleFulfilled(state, action, "users")
      )
      .addCase(getUsers.rejected, handleRejected)

      .addCase(getStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.student = action.payload; // Add a property `student` to hold the fetched student
        state.loading = false;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = apiSlice.actions;
export const apiReducer = apiSlice.reducer;
