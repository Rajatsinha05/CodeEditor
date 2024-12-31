import { configureStore, combineReducers } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import { apiReducer } from "./apiSlice";
import { contestReducer } from "./contestSlice";

import { contestAttemptReducer } from "./contestAttemptSlice";
import { questionsReducer } from "./Question/questionsSlice";
import { themeReducer } from "./Theme/themeSlice";
import { userReducer } from "./User/userSlice";
import { studentsReducer } from "./Student/studentsSlice";
import { solvedQuestionReducer } from "./ContestQuestionSolvedSplice";
import { questionSolvedReducer } from "./Question/questionSolvedSlice";
import { batchReducer } from "./Batch/batchSlice";
import { testDetailReducer } from "./project/slice";

// Combine all reducers into a single rootReducer
const rootReducer = combineReducers({
  editor: editorReducer,
  user: userReducer,
  data: apiReducer,
  contest: contestReducer,
  solved: solvedQuestionReducer,
  contestAttempt: contestAttemptReducer,
  question: questionsReducer,
  theme: themeReducer,
  student: studentsReducer,
  questionSolved: questionSolvedReducer,
  batch: batchReducer,
  testDetails: testDetailReducer,
});

// Configure the store with the rootReducer
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check if needed
    }),
  devTools: process.env.NODE_ENV !== "production",
});
