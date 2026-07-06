import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../auth-slice";
import { fetchWithAuth } from "../../../utils/retry-api-calls";

// Fetch all withdrawal requests (admin)
export const getAdminWithdrawals = createAsyncThunk(
  "adminWithdrawals/getAdminWithdrawals",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/withdrawals/admin/list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
        return rejectWithValue(data.message || "Failed to fetch withdrawal requests");
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

// Update withdrawal status (admin)
export const updateAdminWithdrawalStatus = createAsyncThunk(
  "adminWithdrawals/updateAdminWithdrawalStatus",
  async ({ withdrawalId, status }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/withdrawals/admin/update-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            id: withdrawalId, 
            status: status 
          }),
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
        return rejectWithValue(data.message || "Failed to update withdrawal status");
      }

      return {
        success: true,
        message: `Withdrawal ${status.toLowerCase()} successfully`,
        data: {
          id: withdrawalId,
          status: status,
          ...data.data,
        },
      };
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

const initialState = {
  withdrawals: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

const adminWithdrawalsSlice = createSlice({
  name: "adminWithdrawals",
  initialState,
  reducers: {
    clearAdminWithdrawalError: (state) => {
      state.error = null;
    },
    clearAdminWithdrawalSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Withdrawal Requests
      .addCase(getAdminWithdrawals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminWithdrawals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawals = action.payload;
      })
      .addCase(getAdminWithdrawals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Withdrawal Status
      .addCase(updateAdminWithdrawalStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAdminWithdrawalStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || "Status updated successfully";
        // Update the withdrawal in the list
        if (action.payload.data) {
          const index = state.withdrawals.findIndex(
            (w) => w.id === action.payload.data.id
          );
          if (index !== -1) {
            state.withdrawals[index] = {
              ...state.withdrawals[index],
              status: action.payload.data.status,
            };
          }
        }
      })
      .addCase(updateAdminWithdrawalStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout, (state) => {
        state.withdrawals = [];
        state.isLoading = false;
        state.error = null;
        state.successMessage = null;
      });
  },
});

export const { 
  clearAdminWithdrawalError, 
  clearAdminWithdrawalSuccess,
} = adminWithdrawalsSlice.actions;

export default adminWithdrawalsSlice.reducer;