import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";
import { generateLongIdFromUUID } from "../utils/idHelper";

// Async thunk to save or update a solved question
export const saveOrUpdateSolvedQuestion = createAsyncThunk(
  "solvedQuestions/saveOrUpdate",
  async (solvedQuestionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/solved-questions/save",
        solvedQuestionData
      );
      

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while saving/updating the solved question."
      );
    }
  }
);

// Async thunk to update obtained marks for a solved question
export const updateObtainedMarks = createAsyncThunk(
  "solvedQuestions/updateMarks",
  async (solvedQuestionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/solved-questions/update-marks",
        solvedQuestionData
      );
      

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while updating obtained marks."
      );
    }
  }
);

// Async thunk to fetch all solved questions by contest ID
export const fetchSolvedQuestionsByContestId = createAsyncThunk(
  "solvedQuestions/fetchByContest",
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/solved-questions/contest/${contestId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching solved questions by contest ID."
      );
    }
  }
);

// Async thunk to fetch all solved questions by student ID and contest ID
export const fetchSolvedQuestionsByStudentIdAndContestId = createAsyncThunk(
  "solvedQuestions/fetchByStudentAndContest",
  async ({ studentId, contestId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/solved-questions/student/${studentId}/contest/${contestId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching solved questions by student and contest ID."
      );
    }
  }
);

// Async thunk to delete a solved question by ID
export const deleteSolvedQuestionById = createAsyncThunk(
  "solvedQuestions/deleteById",
  async (solvedQuestionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/solved-questions/${solvedQuestionId}`
      );
      return { solvedQuestionId, message: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while deleting the solved question."
      );
    }
  }
);

// Async thunk to fetch a specific solved question by ID
export const fetchSolvedQuestionById = createAsyncThunk(
  "solvedQuestions/fetchById",
  async (solvedQuestionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/solved-questions/${solvedQuestionId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching the solved question by ID."
      );
    }
  }
);

// Async thunk to fetch the top 20 ranked students
export const fetchTop20RankedStudents = createAsyncThunk(
  "solvedQuestions/fetchTop20RankedStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/solved-questions/top-20");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching the top 20 ranked students."
      );
    }
  }
);

// Define the initial state for solved questions
const initialSolvedQuestionsState = {
  solvedQuestions: [],
  solvedQuestion: {},
  loading: false,
  error: null,
  topRankedStudents: [],
};

// Create the slice for solved questions
export const solvedQuestionSlice = createSlice({
  name: "solvedQuestions",
  initialState: initialSolvedQuestionsState,
  reducers: {}, // No custom reducers needed as of now
  extraReducers: (builder) => {
    builder
      // Save or Update Solved Question Reducers
      .addCase(saveOrUpdateSolvedQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOrUpdateSolvedQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.solvedQuestions.findIndex(
          (sq) => sq.id === action.payload.id
        );
        if (index !== -1) {
          state.solvedQuestions[index] = action.payload;
        } else {
          state.solvedQuestions.push(action.payload);
        }
      })
      .addCase(saveOrUpdateSolvedQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Obtained Marks Reducers
      .addCase(updateObtainedMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateObtainedMarks.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.solvedQuestions.findIndex(
          (sq) => sq.id === action.payload.id
        );
        if (index !== -1) {
          state.solvedQuestions[index].obtainedMarks =
            action.payload.obtainedMarks;
        }
      })
      .addCase(updateObtainedMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Solved Questions by Contest ID Reducers
      .addCase(fetchSolvedQuestionsByContestId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolvedQuestionsByContestId.fulfilled, (state, action) => {
        state.solvedQuestions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSolvedQuestionsByContestId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Solved Questions by Student and Contest ID Reducers
      .addCase(fetchSolvedQuestionsByStudentIdAndContestId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSolvedQuestionsByStudentIdAndContestId.fulfilled,
        (state, action) => {
          state.solvedQuestions = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchSolvedQuestionsByStudentIdAndContestId.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Fetch Specific Solved Question by ID Reducers
      .addCase(fetchSolvedQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolvedQuestionById.fulfilled, (state, action) => {
        state.solvedQuestion = action.payload;
        state.loading = false;
      })
      .addCase(fetchSolvedQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Solved Question by ID Reducers
      .addCase(deleteSolvedQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSolvedQuestionById.fulfilled, (state, action) => {
        state.solvedQuestions = state.solvedQuestions.filter(
          (sq) => sq.id !== action.payload.solvedQuestionId
        );
        state.loading = false;
      })
      .addCase(deleteSolvedQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Top 20 Ranked Students Reducers
      .addCase(fetchTop20RankedStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTop20RankedStudents.fulfilled, (state, action) => {
        state.topRankedStudents = action.payload;
        state.loading = false;
      })
      .addCase(fetchTop20RankedStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const solvedQuestionReducer = solvedQuestionSlice.reducer;
