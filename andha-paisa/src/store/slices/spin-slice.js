import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../../utils/retry-api-calls";

// Spin the wheel
export const spinWheel = createAsyncThunk(
  "spin/spinWheel",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/mini-games/spin",
        { method: "POST", body: JSON.stringify({}) },
        { rejectWithValue, dispatch, getState }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to spin");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Get spin count (remaining spins for today)
export const getSpinCount = createAsyncThunk(
  "spin/getSpinCount",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/mini-games/spin-count",
        { method: "GET" },
        { rejectWithValue, dispatch, getState }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch spin count");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const initialState = {
  points: 0,
  isLoading: false,
  isSpinning: false,
  error: null,
  lastSpinResult: null,
  spinLimit: {
    allowedSpins: 5,
    usedSpins: 0,
    remainingSpins: 5,
  },
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
        state.points = action.payload.data.pointsBalance;
        // After successful spin, refresh spin count
        // We'll dispatch getSpinCount in component instead of here to keep pure
      })
      .addCase(spinWheel.rejected, (state, action) => {
        state.isSpinning = false;
        state.error = action.payload;
      })
      // Get Spin Count
      .addCase(getSpinCount.pending, (state) => {
        state.error = null;
      })
      .addCase(getSpinCount.fulfilled, (state, action) => {
        const { allowedSpins, usedSpins } = action.payload.data;
        state.spinLimit = {
          allowedSpins: parseInt(allowedSpins),
          usedSpins: usedSpins,
          remainingSpins: allowedSpins - usedSpins,
        };
      })
      .addCase(getSpinCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastSpinResult } = spinSlice.actions;
export default spinSlice.reducer;