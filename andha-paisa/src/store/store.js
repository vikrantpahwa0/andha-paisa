import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import surveyReducer from "./slices/survey-slice";
import userSurveyReducer from "./slices/user-survey-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    survey: surveyReducer,
    userSurvey: userSurveyReducer,
  },
});
