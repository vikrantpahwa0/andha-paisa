import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../../utils/retry-api-calls"; // adjust import path as needed

// Get User Surveys (For users dashboard)
export const getUserSurveys = createAsyncThunk(
  "userSurvey/getUserSurveys",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/surveys/list-user-surveys",
        { method: "GET" },
        { rejectWithValue, dispatch, getState }
      );

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

// Get Single Survey by ID
export const getSurveyById = createAsyncThunk(
  "userSurvey/getSurveyById",
  async (surveyId, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        `/surveys/get-survey/${surveyId}`,
        { method: "GET" },
        { rejectWithValue, dispatch, getState }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch survey");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

export const submitUserSurvey = createAsyncThunk(
  "userSurvey/submitUserSurvey",
  async ({ surveyId, answers }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/surveys/submit-user-survey",
        {
          method: "POST",
          body: JSON.stringify({ surveyId, answers }),
        },
        { rejectWithValue, dispatch, getState }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Submission failed");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const initialState = {
  surveys: [],
  currentSurvey: null,
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
    clearCurrentSurvey: (state) => {
      state.currentSurvey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Surveys
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
      })
      // Get Single Survey
      .addCase(getSurveyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSurveyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSurvey = action.payload.data;
      })
      .addCase(getSurveyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitUserSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitUserSurvey.fulfilled, (state) => {
        state.isLoading = false;
        state.currentSurvey = null; // clear after successful submission
      })
      .addCase(submitUserSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSurveys, clearCurrentSurvey } = userSurveySlice.actions;
export default userSurveySlice.reducer;