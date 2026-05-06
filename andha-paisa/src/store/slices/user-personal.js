// src/store/slices/user-personal.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./auth-slice";                 // ✅ import logout action
import { fetchWithAuth } from "../../utils/retry-api-calls";

export const fetchUserProfile = createAsyncThunk(
  "userPersonal/fetchProfile",
  async (options, { rejectWithValue, dispatch, getState }) => {
    try {
      const query = options?.fetchBankDetails ? "?includeBankDetails=true" : "";
      const response = await fetchWithAuth(
        `/auth/fetchUser${query}`,
        { method: "GET" },
        { rejectWithValue, dispatch, getState }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to fetch profile");
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "userPersonal/updateProfile",
  async (profileData, { rejectWithValue, dispatch, getState }) => {
    try {
      const { auth, userPersonal } = getState();
      const userId = userPersonal.profile?.id || auth.user?.id;
      if (!userId) throw new Error("User ID missing");

      const response = await fetchWithAuth(
        "/auth/update-user",
        {
          method: "POST",
          body: JSON.stringify({ userId, userDetails: profileData }),
        },
        { rejectWithValue, dispatch, getState }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Profile update failed");
      }
      // Refetch to get the latest user data (including new profilePicture URL)
      await dispatch(fetchUserProfile({ fetchBankDetails: true }));
      // Return only non-image fields for optimistic update (name, email, etc.)
      const { profilePicture, ...optimisticData } = profileData;
      return optimisticData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserBankDetails = createAsyncThunk(
  "userPersonal/updateBankDetails",
  async (bankData, { rejectWithValue, dispatch, getState }) => {
    try {
      const { auth, userPersonal } = getState();
      const userId = userPersonal.profile?.id || auth.user?.id;
      if (!userId) throw new Error("User ID missing");

      const response = await fetchWithAuth(
        "/auth/update-user",
        {
          method: "POST",
          body: JSON.stringify({ userId, bankDetails: bankData }),
        },
        { rejectWithValue, dispatch, getState }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || "Bank details update failed");
      }
      // Refetch to get the latest bank details from server
      await dispatch(fetchUserProfile({ fetchBankDetails: true }));
      // Return the optimistic update
      return bankData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  profile: null,
  bankDetails: null,
  isLoading: false,
  error: null,
};

const userPersonalSlice = createSlice({
  name: "userPersonal",
  initialState,
  reducers: {
    clearUserPersonal: (state) => {
      state.profile = null;
      state.bankDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          profilePicture: action.payload.profilePicture || null,
          balance: 0,
          joinDate: new Date().toISOString().split("T")[0],
        };
        if (action.payload.bankDetail) {
          state.bankDetails = {
            account_holder_name: action.payload.bankDetail.account_holder_name,
            bank_name: action.payload.bankDetail.bank_name,
            account_number: action.payload.bankDetail.account_number,
            ifsc_code: action.payload.bankDetail.ifsc_code,
          };
        }
        // Keeps existing bankDetails if API doesn't return them
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // Only update non-image fields (name, email, etc.) - preserve profilePicture
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserBankDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserBankDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.bankDetails = action.payload;
        }
      })
      .addCase(updateUserBankDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ✅ Clear profile when logout is dispatched
      .addCase(logout, (state) => {
        state.profile = null;
        state.bankDetails = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearUserPersonal } = userPersonalSlice.actions;
export default userPersonalSlice.reducer;