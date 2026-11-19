import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL =
  `${import.meta.env.VITE_BE_URL}/api` || "http://localhost:5000/api";

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("accessToken");
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const sendApplication = createAsyncThunk(
  "application/sendApplication",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiRequest("/applications/send", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  },
);

export const fetchApplications = createAsyncThunk(
  "application/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest("/applications", { method: "GET" });
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  },
);

// NEW: toggle stop_follow_up on a single application
export const toggleFollowUp = createAsyncThunk(
  "application/toggleFollowUp",
  async (id, { rejectWithValue }) => {
    try {
      return await apiRequest(`/applications/${id}/toggle-follow-up`, {
        method: "PATCH",
      });
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  },
);

const initialState = {
  applications: [],
  lastSent: null,
  isLoading: false,
  isSending: false,
  isToggling: false, // NEW
  error: null,
};

const applicationsSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastSent: (state) => {
      state.lastSent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendApplication.pending, (state) => {
        state.isSending = true;
        state.error = null;
        state.lastSent = null;
      })
      .addCase(sendApplication.fulfilled, (state, action) => {
        state.isSending = false;
        state.lastSent = action.payload.data;
        state.applications.unshift(action.payload.data); // Add to history
      })
      .addCase(sendApplication.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.data || [];
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // NEW: toggle follow-up
      .addCase(toggleFollowUp.pending, (state) => {
        state.isToggling = true;
      })
      .addCase(toggleFollowUp.fulfilled, (state, action) => {
        state.isToggling = false;
        const updated = action.payload?.data;
        if (!updated?.id) return;

        state.applications = state.applications.map((a) =>
          a.id === updated.id ? updated : a,
        );

        // Keep lastSent in sync if the same app is being shown in the "just sent" card
        if (state.lastSent?.id === updated.id) {
          state.lastSent = updated;
        }
      })
      .addCase(toggleFollowUp.rejected, (state, action) => {
        state.isToggling = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastSent } = applicationsSlice.actions;
export default applicationsSlice.reducer;
