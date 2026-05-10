import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../../utils/retry-api-calls";

// Spin the wheel
export const spinWheel = createAsyncThunk(
  "spin/spinWheel",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/mini-games/spin",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        { rejectWithValue, dispatch, getState },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to spin");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

const initialState = {
  points: 0,
  isLoading: false,
  isSpinning: false,
  error: null,
  lastSpinResult: null,
};

const spinSlice = createSlice({
  name: "spin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastSpinResult: (state) => {
      state.lastSpinResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Spin Wheel
      .addCase(spinWheel.pending, (state) => {
        state.isSpinning = true;
        state.error = null;
      })
      .addCase(spinWheel.fulfilled, (state, action) => {
        state.isSpinning = false;
        state.lastSpinResult = action.payload.data;
        // Update points from the response
        state.points = action.payload.data.pointsBalance;
      })
      .addCase(spinWheel.rejected, (state, action) => {
        state.isSpinning = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastSpinResult } = spinSlice.actions;
export default spinSlice.reducer;
