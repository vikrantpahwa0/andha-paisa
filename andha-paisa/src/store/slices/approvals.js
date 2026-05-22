// store/slices/approvals-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../../utils/retry-api-calls";

// Get Withdrawable Transactions
export const getWithdrawableTransactions = createAsyncThunk(
  "approvals/getWithdrawableTransactions",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/admin/approvals/fetch-withdrawable-transactions",
        { method: "GET" },
        { rejectWithValue, dispatch, getState }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch withdrawable transactions");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const initialState = {
  withdrawableTransactions: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

const approvalsSlice = createSlice({
  name: "approvals",
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
      // Get Withdrawable Transactions
      .addCase(getWithdrawableTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWithdrawableTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawableTransactions = action.payload.data || [];
      })
      .addCase(getWithdrawableTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = approvalsSlice.actions;
export default approvalsSlice.reducer;