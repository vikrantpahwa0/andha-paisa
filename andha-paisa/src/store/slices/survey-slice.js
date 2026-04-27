import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create or Update Survey
export const createUpdateSurvey = createAsyncThunk(
  "survey/createUpdateSurvey",
  async (
    { surveyBasicInfo, questions, surveyId = null },
    { rejectWithValue, getState },
  ) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const response = await fetch(
        "http://localhost:3000/surveys/create-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ surveyBasicInfo, questions, surveyId }),
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

const initialState = {
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
      });
  },
});

export const { clearError, clearSuccessMessage } = surveySlice.actions;
export default surveySlice.reducer;
