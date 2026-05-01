import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem("accessToken");
};

// Create or Update Survey
export const createUpdateSurvey = createAsyncThunk(
  "survey/createUpdateSurvey",
  async ({ surveyBasicInfo, questions }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Something went wrong");
      }

      const response = await fetch(
        "http://localhost:3000/surveys/create-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ surveyBasicInfo, questions }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to save survey");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

// Get All Surveys
export const getSurveysList = createAsyncThunk(
  "survey/getSurveysList",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Something went wrong");
      }

      const response = await fetch("http://localhost:3000/surveys/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch surveys");
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