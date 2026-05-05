import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BE_URL = import.meta.env.VITE_BE_URL;

const getAuthHeader = (getState) => {
  const token = getState().auth.accessToken;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchUserProfile = createAsyncThunk(
  'userPersonal/fetchProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${BE_URL}/auth/fetchUser`, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(getState) },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to fetch profile');
      }
      // API returns user object directly under data.data
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'userPersonal/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${BE_URL}/auth/updateProfile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(getState) },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Profile update failed');
      }
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserBankDetails = createAsyncThunk(
  'userPersonal/updateBankDetails',
  async (bankData, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${BE_URL}/auth/updateBankDetails`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader(getState) },
        body: JSON.stringify(bankData),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Bank details update failed');
      }
      return data.data;
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
        // action.payload now contains { id, name, email }
        state.profile = {
          name: action.payload.name,
          email: action.payload.email,
          avatarUrl: action.payload.avatarUrl || null,
          joinDate: action.payload.joinDate || null,
          balance: action.payload.balance || 0,
        };
        // If your API returns bankDetails separately, keep this; otherwise set null
        state.bankDetails = action.payload.bankDetails || null;
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
        state.bankDetails = action.payload.bankDetails || action.payload;
      })
      .addCase(updateUserBankDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserPersonal } = userPersonalSlice.actions;
export default userPersonalSlice.reducer;