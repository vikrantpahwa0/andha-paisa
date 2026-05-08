import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BE_URL = import.meta.env.VITE_BE_URL;

// Helper functions for token management
const storeTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Refresh token thunk
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }
      
      const response = await fetch(`${BE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
      });
      
      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to refresh token');
      }
      
      // Store new tokens
      storeTokens(data.data.accessToken, data.data.refreshToken);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Send OTP
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ mobile, country_code, email }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, country_code: country_code || '+91', email })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to send OTP');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, mobile, country_code, otp }, { rejectWithValue }) => {
    try {
      const body = {
        otp,
        country_code: country_code || '+91'
      };
      
      if (email) body.email = email;
      if (mobile) body.mobile = mobile;
      
      const response = await fetch(`${BE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Invalid OTP');
      }
      
      // Store tokens if they exist in response
      if (data.data?.accessToken && data.data?.refreshToken) {
        storeTokens(data.data.accessToken, data.data.refreshToken);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, mobile_number, country_code, password, terms_accepted, verificationId }, { rejectWithValue }) => {
    try {
      const body = {
        name,
        country_code: country_code || '+91',
        terms_accepted,
        verificationId
      };
      
      if (email) body.email = email;
      if (mobile_number) body.mobile_number = mobile_number;
      if (password) body.password = password;
      
      const response = await fetch(`${BE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Registration failed');
      }
      
      // Store tokens if they exist in response
      if (data.data?.accessToken && data.data?.refreshToken) {
        storeTokens(data.data.accessToken, data.data.refreshToken);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Login failed');
      }
      
      // Store tokens in localStorage
      if (data.data?.accessToken && data.data?.refreshToken) {
        storeTokens(data.data.accessToken, data.data.refreshToken);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Initialize state from localStorage
const getInitialState = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  
  return {
    isLoading: false,
    error: null,
    user: null,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    isAuthenticated: !!accessToken && !isTokenExpired(accessToken),
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Added logout reducer
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data?.accessToken) {
          state.accessToken = action.payload.data.accessToken;
          state.isAuthenticated = true;
        }
        if (action.payload.data?.refreshToken) {
          state.refreshToken = action.payload.data.refreshToken;
        }
        if (action.payload.data?.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.data?.accessToken || null;
        state.refreshToken = action.payload.data?.refreshToken || null;
        state.isAuthenticated = !!state.accessToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.data?.accessToken || null;
        state.refreshToken = action.payload.data?.refreshToken || null;
        state.isAuthenticated = !!state.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Refresh Token
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.data?.accessToken;
        if (action.payload.data?.refreshToken) {
          state.refreshToken = action.payload.data.refreshToken;
        }
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
  // Refresh token is invalid/expired – force logout
  state.isAuthenticated = false;
  state.accessToken = null;
  state.refreshToken = null;
  clearTokens();
  
})
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;