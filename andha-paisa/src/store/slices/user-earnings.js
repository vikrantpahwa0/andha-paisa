import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../../utils/retry-api-calls";

export const fetchUserEarnings = createAsyncThunk(
  "earnings/fetch",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/auth/fetch-earnings",
        { method: "GET" },
        { rejectWithValue, dispatch, getState }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch earnings");
      }
      return data.data; // { attempted, completed, points, withdrawLimit }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const earningsSlice = createSlice({
  name: "earnings",
  initialState: {
    confirmedAmount: 0,    // total points (₹) from completed surveys
    reviewAmount: 0,       // currently 0 (API doesn't provide in‑review amount)
    withdrawLimit: 500,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserEarnings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserEarnings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.confirmedPoints = action.payload.points || 0;
        state.withdrawLimit = action.payload.withdrawLimit || 500;
        state.completedAmount = action.payload.completed || 0;
        // If API later adds 'reviewAmount', map it here; for now set 0
        state.reviewAmount = action.payload.attempted;
      })
      .addCase(fetchUserEarnings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default earningsSlice.reducer;