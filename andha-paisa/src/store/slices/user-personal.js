// src/store/slices/user-personal.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BE_URL = import.meta.env.VITE_BE_URL;

const getAuthHeader = (getState) => {
  const token = getState().auth.accessToken;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchUserProfile = createAsyncThunk(
  'userPersonal/fetchProfile',
  async (options, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${BE_URL}/auth/fetchUser${options?.fetchBankDetails ? '?includeBankDetails=true' : ''}`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(getState) },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to fetch profile');
      }
      return data.data; // { id, name, email, bankDetail }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'userPersonal/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const { auth, userPersonal } = getState();
      const userId = userPersonal.profile?.id || auth.user?.id;
      if (!userId) throw new Error('User ID missing');

      const response = await fetch(`${BE_URL}/auth/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(getState) },
        body: JSON.stringify({ userId, userDetails: profileData }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Profile update failed');
      }
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserBankDetails = createAsyncThunk(
  'userPersonal/updateBankDetails',
  async (bankData, { rejectWithValue, getState }) => {
    try {
      const { auth, userPersonal } = getState();
      const userId = userPersonal.profile?.id || auth.user?.id;
      if (!userId) throw new Error('User ID missing');

      const response = await fetch(`${BE_URL}/auth/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(getState) },
        body: JSON.stringify({ userId, bankDetails: bankData }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Bank details update failed');
      }
      return bankData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: null,
  bankDetails: null,
  isLoading: false,
  error: null,
};

const userPersonalSlice = createSlice({
  name: 'userPersonal',
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
          avatarUrl: null,
          balance: 0,
          joinDate: new Date().toISOString().split('T')[0],
        };
        // ✅ FIX: map `bankDetail` (singular) from API to `bankDetails` (plural)
        if (action.payload.bankDetail) {
          state.bankDetails = {
            account_holder_name: action.payload.bankDetail.account_holder_name,
            bank_name: action.payload.bankDetail.bank_name,
            account_number: action.payload.bankDetail.account_number,
            ifsc_code: action.payload.bankDetail.ifsc_code,
          };
        } else {
          state.bankDetails = null;
        }
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
        state.profile = { ...state.profile, ...action.payload };
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
        state.bankDetails = action.payload;
      })
      .addCase(updateUserBankDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserPersonal } = userPersonalSlice.actions;
export default userPersonalSlice.reducer;