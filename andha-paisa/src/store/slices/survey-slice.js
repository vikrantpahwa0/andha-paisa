import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../../utils/retry-api-calls"; // adjust import path as needed

// Create or Update Survey
export const createUpdateSurvey = createAsyncThunk(
  "survey/createUpdateSurvey",
  async ({ surveyBasicInfo, questions }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/surveys/create-update",
        {
          method: "POST",
          body: JSON.stringify({ surveyBasicInfo, questions }),
        },
        { rejectWithValue, dispatch, getState }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to save survey");
      }

      return data;
    } catch (error) {
      // If error comes from fetchWithAuth (e.g., refresh failure), it's already a rejected value
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Get All Surveys
export const getSurveysList = createAsyncThunk(
  "survey/getSurveysList",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/surveys/list",
        { method: "GET" },
        { rejectWithValue, dispatch, getState }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch surveys");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const initialState = {
  surveys: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create/Update Survey
      .addCase(createUpdateSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createUpdateSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createUpdateSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Surveys List
      .addCase(getSurveysList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSurveysList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.surveys = action.payload.data || [];
      })
      .addCase(getSurveysList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = surveySlice.actions;
export default surveySlice.reducer;