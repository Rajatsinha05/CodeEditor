import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import { apiReducer } from "./apiSlice";
import { contestReducer } from "./contestSlice";
import { solvedQuestionReducer } from "./QuestionSolvedSplice";
import { contestAttemptReducer } from "./contestAttemptSlice";
import { questionsReducer } from "./Question/questionsSlice";
import { themeReducer } from "./Theme/themeSlice";
import { userReducer } from "./User/userSlice";

// Configure the store with the different reducers
export const store = configureStore({
  reducer: {
    editor: editorReducer,
    user: userReducer,
    data: apiReducer,
    contest: contestReducer,
    solved: solvedQuestionReducer,
    contestAttempt: contestAttemptReducer,
    question: questionsReducer,
    theme: themeReducer,
  },
});
