import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import surveyReducer from "./slices/survey-slice";
import userSurveyReducer from "./slices/user-survey-slice";
import userPersonalReducer from "./slices/user-personal";
import earningsReducer from "./slices/user-earnings";
import spinReducer from "./slices/spin-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    survey: surveyReducer,
    userSurvey: userSurveyReducer,
    userPersonal: userPersonalReducer,
    earnings: earningsReducer,
    spin: spinReducer,
  },
});
