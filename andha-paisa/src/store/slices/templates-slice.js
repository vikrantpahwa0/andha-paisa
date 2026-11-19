import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL =
  `${import.meta.env.VITE_BE_URL}/api` || "http://localhost:5000/api";

// ---- Simple API helper (no retry) ----
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

// ---- Thunks ----
export const fetchTemplates = createAsyncThunk(
  "template/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest("/templates", { method: "GET" });
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  },
);

export const fetchTemplateById = createAsyncThunk(
  "template/fetchTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      return await apiRequest(`/templates/${id}`, { method: "GET" });
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  },
);

export const createTemplate = createAsyncThunk(
  "template/createTemplate",
  async (formData, { rejectWithValue }) => {
    try {
      return await apiRequest("/templates", { method: "POST", body: formData });
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  },
);

export const updateTemplate = createAsyncThunk(
  "template/updateTemplate",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await apiRequest(`/templates/${id}`, {
        method: "PUT",
        body: formData,
      });
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  },
);

export const deleteTemplate = createAsyncThunk(
  "template/deleteTemplate",
  async (id, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/templates/${id}`, { method: "DELETE" });
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  },
);

// ---- Slice ----
const initialState = {
  templates: [],
  currentTemplate: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

const templatesSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload.data || [];
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.currentTemplate = action.payload.data;
      })

      .addCase(createTemplate.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isSaving = false;
        state.templates.unshift(action.payload.data);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })

      .addCase(updateTemplate.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.isSaving = false;
        const updated = action.payload.data;
        state.templates = state.templates.map((t) =>
          t.id === updated.id ? updated : t,
        );
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })

      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(
          (t) => t.id !== action.payload.id,
        );
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentTemplate } = templatesSlice.actions;
export default templatesSlice.reducer;
