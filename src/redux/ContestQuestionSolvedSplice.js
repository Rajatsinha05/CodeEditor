import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";

// Async thunks
export const fetchSolvedQuestionsByContestStudentAndQuestion = createAsyncThunk(
  "solvedQuestions/fetchByContestStudentAndQuestion",
  async ({ contestId, studentId, questionId }, { rejectWithValue }) => {
    console.log(
      " contestId, studentId, questionId: ",
      contestId,
      studentId,
      questionId
    );
    try {
      const response = await axiosInstance.get(
        `/api/solved-questions/contest/${contestId}/student/${studentId}/question/${questionId}`
      );
      

      return response.data;
    } catch (error) {
      

      return rejectWithValue(
        error ||
          "An error occurred while fetching solved questions by contest ID, student ID, and question ID."
      );
    }
  }
);
// Save or Update a Solved Question
export const saveOrUpdateSolvedQuestion = createAsyncThunk(
  "solvedQuestions/saveOrUpdate",
  async (solvedQuestionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/solved-questions/save-or-update",
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

// Create a Solved Question
export const SolvedQuestionInContest = createAsyncThunk(
  "solvedQuestions/create",
  async (solvedQuestionData, { rejectWithValue }) => {
    
    try {
      const response = await axiosInstance.post(
        "/api/solved-questions/create",
        solvedQuestionData
      );
      return response.data;
    } catch (error) {
      
      return rejectWithValue(error);
    }
  }
);

// Update Obtained Marks
export const updateObtainedMarks = createAsyncThunk(
  "solvedQuestions/updateMarks",
  async (solvedQuestionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/api/solved-questions/marks/update",
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

// Fetch Solved Questions by Contest ID
export const fetchSolvedQuestionsByContestId = createAsyncThunk(
  "solvedQuestions/fetchByContest",
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/solved-questions/contest/${contestId}`
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

// Fetch Solved Questions by Student and Contest ID
export const fetchSolvedQuestionsByStudentIdAndContestId = createAsyncThunk(
  "solvedQuestions/fetchByStudentAndContest",
  async ({ studentId, contestId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/solved-questions/student/${studentId}/contest/${contestId}`
      );
      
      return response.data;
    } catch (error) {
      
      return rejectWithValue(
        error ||
          "An error occurred while fetching solved questions by student and contest ID."
      );
    }
  }
);
// Fetch Solved Question by ID
export const fetchSolvedQuestionById = createAsyncThunk(
  "solvedQuestions/fetchById",
  async (solvedQuestionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/solved-questions/${solvedQuestionId}`
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

// Fetch Top 20 Ranked Students
export const fetchTop20RankedStudents = createAsyncThunk(
  "solvedQuestions/fetchTop20RankedStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/api/solved-questions/rankings/top-20"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching the top 20 ranked students."
      );
    }
  }
);

// Delete Solved Question by ID
export const deleteSolvedQuestionById = createAsyncThunk(
  "solvedQuestions/deleteById",
  async (solvedQuestionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/solved-questions/${solvedQuestionId}`
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

// Initial state
const initialSolvedQuestionsState = {
  solvedQuestions: [],
  solvedQuestion: {},
  loading: false,
  error: null,
  topRankedStudents: [],
};

// Redux slice
export const solvedQuestionSlice = createSlice({
  name: "solvedQuestions",
  initialState: initialSolvedQuestionsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Solved Question
      .addCase(SolvedQuestionInContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SolvedQuestionInContest.fulfilled, (state, action) => {
        state.loading = false;
        state.solvedQuestions.push(action.payload);
      })
      .addCase(SolvedQuestionInContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Solved Questions by Contest, Student, and Question
      .addCase(
        fetchSolvedQuestionsByContestStudentAndQuestion.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchSolvedQuestionsByContestStudentAndQuestion.fulfilled,
        (state, action) => {
          state.solvedQuestions = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchSolvedQuestionsByContestStudentAndQuestion.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Save or Update Solved Question
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

      // Update Obtained Marks
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

      // Fetch Solved Questions by Contest ID
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

      // Fetch Solved Questions by Student and Contest ID
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

      // Fetch Solved Question by ID
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

      // Fetch Top 20 Ranked Students
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
      })

      // Delete Solved Question by ID
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
      });
  },
});

export const solvedQuestionReducer = solvedQuestionSlice.reducer;
