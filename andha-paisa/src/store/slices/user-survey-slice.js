import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BE_URL = import.meta.env.VITE_BE_URL || 'http://localhost:3000';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem("accessToken");
};

// Get User Surveys (For users dashboard)
export const getUserSurveys = createAsyncThunk(
  "userSurvey/getUserSurveys",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Something went wrong");
      }

      const response = await fetch(`${BE_URL}/surveys/list-user-surveys`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch user surveys");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

const initialState = {
  surveys: [],
  isLoading: false,
  error: null,
};

const userSurveySlice = createSlice({
  name: "userSurvey",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSurveys: (state) => {
      state.surveys = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserSurveys.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserSurveys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.surveys = action.payload.data || [];
      })
      .addCase(getUserSurveys.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSurveys } = userSurveySlice.actions;
export default userSurveySlice.reducer;