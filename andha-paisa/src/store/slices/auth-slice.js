import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Send OTP
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ mobile, country_code, email }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/auth/send-otp', {
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
      
      const response = await fetch('http://localhost:3000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Invalid OTP');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, mobile_number, country_code, password, terms_accepted }, { rejectWithValue }) => {
    try {
      const body = {
        name,
        country_code: country_code || '+91',
        terms_accepted
      };
      
      if (email) body.email = email;
      if (mobile_number) body.mobile_number = mobile_number;
      if (password) body.password = password;
      
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Registration failed');
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
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState = {
  isLoading: false,
  error: null,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
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
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
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
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;