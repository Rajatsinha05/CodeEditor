import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// Async Thunks for CRUD operations
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/students");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch students."
      );
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  "students/fetchStudentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to fetch student with ID: ${id}.`
      );
    }
  }
);

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (student, { rejectWithValue }) => {
    try {
      const studentWithId = { ...student, id: generateLongIdFromUUID() };
      const response = await axiosInstance.post("/students", studentWithId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create student."
      );
    }
  }
);

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/students/${id}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to update student with ID: ${id}.`
      );
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/students/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || `Failed to delete student with ID: ${id}.`
      );
    }
  }
);

export const fetchStudentsByBranchCode = createAsyncThunk(
  "students/fetchStudentsByBranchCode",
  async (branchCode, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/students/branch/${branchCode}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          `Failed to fetch students for branchCode: ${branchCode}.`
      );
    }
  }
);

// Initial State
const initialState = {
  students: [],
  student: null,
  loading: false,
  error: null,
};

// Students Slice
const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Student by ID
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.student = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Student
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
      // Update Student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(
          (student) => student.id === action.payload.id
        );
        if (index !== -1) state.students[index] = action.payload;
        state.loading = false;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (student) => student.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentsByBranchCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsByBranchCode.fulfilled, (state, action) => {
        state.students = action.payload; // Replace students with branch-specific data
        state.loading = false;
      })
      .addCase(fetchStudentsByBranchCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const studentsReducer = studentsSlice.reducer;
