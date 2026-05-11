import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../../utils/retry-api-calls";

export const fetchTransactions = createAsyncThunk(
  "activity/fetchTransactions",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/auth/transactions",
        { method: "GET" },
        { rejectWithValue, dispatch, getState }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch transactions");
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  surveyTransactions: [],
  miniGamesTransactions: [],
  isLoading: false,
  error: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearActivity: (state) => {
      state.surveyTransactions = [];
      state.miniGamesTransactions = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.surveyTransactions = action.payload.surveyTransactions || [];
        state.miniGamesTransactions = action.payload.miniGamesTransactions || [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearActivity } = activitySlice.actions;
export default activitySlice.reducer;