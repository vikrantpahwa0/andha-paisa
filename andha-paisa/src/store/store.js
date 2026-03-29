import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice"; // Import your auth slice

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth reducer
  },
});