import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import {
  createProject,
  deleteProject,
  fetchProjectById,
  fetchProjects,
  updateProject,
} from "./proejctApi";
import {
  createEducation,
  deleteEducation,
  fetchEducation,
  fetchEducationById,
  updateEducation,
} from "./educationApi";
import {
  createCertificate,
  deleteCertificate,
  fetchCertificateById,
  fetchCertificates,
  updateCertificate,
} from "./CertificateApi";
import {
  createExperience,
  deleteExperience,
  fetchExperience,
  fetchExperienceById,
  updateExperience,
} from "./ExperienceApi";

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

export const fetchStudentDetailsById = createAsyncThunk(
  "students/fetchStudentDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/students/${id}/details`);

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

      // Fetch Student details by ID
      .addCase(fetchStudentDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDetailsById.fulfilled, (state, action) => {
        state.student = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudentDetailsById.rejected, (state, action) => {
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
      })

      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        if (state.student) {
          state.student.projects = action.payload; // Assign fetched projects to student
        }
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        if (state.student && state.student.projects) {
          const projectIndex = state.student.projects.findIndex(
            (project) => project.id === action.payload.id
          );
          if (projectIndex !== -1) {
            state.student.projects[projectIndex] = action.payload;
          } else {
            state.student.projects = [
              ...state.student.projects,
              action.payload,
            ];
          }
        }
        state.loading = false;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Project and Add to Student
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        if (state.student && state.student.projects) {
          state.student.projects = [...state.student.projects, action.payload];
        } else if (state.student) {
          state.student.projects = [action.payload];
        }
        state.loading = false;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Project within Student
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        if (state.student && state.student.projects) {
          const index = state.student.projects.findIndex(
            (project) => project.id === action.payload.id
          );
          if (index !== -1) state.student.projects[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Project from Student
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        if (state.student && state.student.projects) {
          state.student.projects = state.student.projects.filter(
            (project) => project.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  education
      .addCase(fetchEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        if (state.student) {
          state.student.educations = action.payload; // Assign fetched educations to student
        }
        state.loading = false;
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Education by ID
      .addCase(fetchEducationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducationById.fulfilled, (state, action) => {
        if (state.student && state.student.educations) {
          const educationIndex = state.student.educations.findIndex(
            (edu) => edu.id === action.payload.id
          );
          if (educationIndex !== -1) {
            state.student.educations[educationIndex] = action.payload;
          } else {
            state.student.educations = [
              ...state.student.educations,
              action.payload,
            ];
          }
        }
        state.loading = false;
      })
      .addCase(fetchEducationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Education and Add to Student
      .addCase(createEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        if (state.student && state.student.educations) {
          state.student.educations = [
            ...state.student.educations,
            action.payload,
          ];
        } else if (state.student) {
          state.student.educations = [action.payload];
        }
        state.loading = false;
      })
      .addCase(createEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Education within Student
      .addCase(updateEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        if (state.student && state.student.educations) {
          const index = state.student.educations.findIndex(
            (edu) => edu.id === action.payload.id
          );
          if (index !== -1) state.student.educations[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Education from Student
      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        if (state.student && state.student.educations) {
          state.student.educations = state.student.educations.filter(
            (edu) => edu.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // certificate api
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        if (state.student) {
          state.student.certificates = action.payload; // Assign fetched certificates to student
        }
        state.loading = false;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Certificate by ID
      .addCase(fetchCertificateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificateById.fulfilled, (state, action) => {
        if (state.student && state.student.certificates) {
          const certIndex = state.student.certificates.findIndex(
            (cert) => cert.id === action.payload.id
          );
          if (certIndex !== -1) {
            state.student.certificates[certIndex] = action.payload;
          } else {
            state.student.certificates = [
              ...state.student.certificates,
              action.payload,
            ];
          }
        }
        state.loading = false;
      })
      .addCase(fetchCertificateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Certificate and Add to Student
      .addCase(createCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCertificate.fulfilled, (state, action) => {
        if (state.student && state.student.certificates) {
          state.student.certificates = [
            ...state.student.certificates,
            action.payload,
          ];
        } else if (state.student) {
          state.student.certificates = [action.payload];
        }
        state.loading = false;
      })
      .addCase(createCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Certificate within Student
      .addCase(updateCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCertificate.fulfilled, (state, action) => {
        if (state.student && state.student.certificates) {
          const index = state.student.certificates.findIndex(
            (cert) => cert.id === action.payload.id
          );
          if (index !== -1) state.student.certificates[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Certificate from Student
      .addCase(deleteCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        if (state.student && state.student.certificates) {
          state.student.certificates = state.student.certificates.filter(
            (cert) => cert.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // exp
      .addCase(fetchExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperience.fulfilled, (state, action) => {
        if (state.student) {
          state.student.experiences = action.payload; // Assign fetched experiences to student
        }
        state.loading = false;
      })
      .addCase(fetchExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Experience by ID
      .addCase(fetchExperienceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExperienceById.fulfilled, (state, action) => {
        if (state.student && state.student.experiences) {
          const experienceIndex = state.student.experiences.findIndex(
            (exp) => exp.id === action.payload.id
          );
          if (experienceIndex !== -1) {
            state.student.experiences[experienceIndex] = action.payload;
          } else {
            state.student.experiences = [
              ...state.student.experiences,
              action.payload,
            ];
          }
        }
        state.loading = false;
      })
      .addCase(fetchExperienceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Experience and Add to Student
      .addCase(createExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        if (state.student && state.student.experiences) {
          state.student.experiences = [
            ...state.student.experiences,
            action.payload,
          ];
        } else if (state.student) {
          state.student.experiences = [action.payload];
        }
        state.loading = false;
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Experience within Student
      .addCase(updateExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        if (state.student && state.student.experiences) {
          const index = state.student.experiences.findIndex(
            (exp) => exp.id === action.payload.id
          );
          if (index !== -1) state.student.experiences[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Experience from Student
      .addCase(deleteExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        if (state.student && state.student.experiences) {
          state.student.experiences = state.student.experiences.filter(
            (exp) => exp.id !== action.payload
          );
        }
        state.loading = false;
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const studentsReducer = studentsSlice.reducer;
