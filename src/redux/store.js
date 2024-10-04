import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import { apiReducer } from "./apiSlice";
import { contestReducer } from "./contestSlice";
import { solvedQuestionReducer } from "./QuestionSolvedSplice";
import { contestAttemptReducer } from "./contestAttemptSlice";

// Configure the store with the different reducers
export const store = configureStore({
  reducer: {
    editor: editorReducer,
    data: apiReducer,
    contest: contestReducer,
    solved: solvedQuestionReducer,
    contestAttempt: contestAttemptReducer,
  },
});
