// src/store/slices/withdrawal-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./auth-slice";
import { fetchWithAuth } from "../../utils/retry-api-calls";

// Create withdrawal request
export const createWithdrawal = createAsyncThunk(
  "withdrawal/create",
  async (amount, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/withdrawals/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        },
        { rejectWithValue, dispatch, getState }
      );

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        return rejectWithValue(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        return rejectWithValue("Invalid response from server");
      }

      if (!data.success) {
        return rejectWithValue(data.message || "Withdrawal failed");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

// Fetch withdrawal history
export const fetchWithdrawalHistory = createAsyncThunk(
  "withdrawal/fetchHistory",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/withdrawals/list",
        { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        },
        { rejectWithValue, dispatch, getState }
      );

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        return rejectWithValue(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        return rejectWithValue("Invalid response from server");
      }

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch history");
      }

      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

const initialState = {
  requests: [],
  isLoading: false,
  error: null,
};

const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState,
  reducers: {
    clearWithdrawalError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create withdrawal
      .addCase(createWithdrawal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWithdrawal.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new withdrawal to the beginning of the list
        if (action.payload) {
          state.requests = [action.payload, ...state.requests];
        }
      })
      .addCase(createWithdrawal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch history
      .addCase(fetchWithdrawalHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawalHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchWithdrawalHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout, (state) => {
        state.requests = [];
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearWithdrawalError } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;