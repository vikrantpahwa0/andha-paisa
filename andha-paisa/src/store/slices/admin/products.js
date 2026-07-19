// src/store/slices/admin/products.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../auth-slice";
import { fetchWithAuth } from "../../../utils/retry-api-calls";

// Fetch all products
export const getProductsList = createAsyncThunk(
  "adminProducts/getProductsList",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/products/list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        { rejectWithValue, dispatch, getState },
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
        return rejectWithValue(data.message || "Failed to fetch products");
      }

      return data.data || data.products || [];
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  },
);

// Fetch categories
export const getCategoriesList = createAsyncThunk(
  "adminProducts/getCategoriesList",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/products/categories/list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        { rejectWithValue, dispatch, getState },
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
        return rejectWithValue(data.message || "Failed to fetch categories");
      }

      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  },
);

// Create or update product
export const createUpdateProduct = createAsyncThunk(
  "adminProducts/createUpdateProduct",
  async (productData, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetchWithAuth(
        "/products/create-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        },
        { rejectWithValue, dispatch, getState },
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
        return rejectWithValue(data.message || "Failed to save product");
      }

      return {
        success: true,
        message:
          data.message ||
          (productData.id
            ? "Product updated successfully"
            : "Product created successfully"),
        data: data.data || data.product,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  },
);

const initialState = {
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  successMessage: null,
  selectedProduct: null,
};

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products List
      .addCase(getProductsList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProductsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Categories List
      .addCase(getCategoriesList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoriesList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategoriesList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create/Update Product
      .addCase(createUpdateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createUpdateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;

        if (action.payload.data) {
          const productData = action.payload.data;
          if (productData.id) {
            const index = state.products.findIndex(
              (p) => p.id === productData.id,
            );
            if (index !== -1) {
              state.products[index] = productData;
            } else {
              state.products.push(productData);
            }
          }
        }
      })
      .addCase(createUpdateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(logout, (state) => {
        state.products = [];
        state.categories = [];
        state.isLoading = false;
        state.error = null;
        state.successMessage = null;
        state.selectedProduct = null;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setSelectedProduct,
  clearSelectedProduct,
} = adminProductsSlice.actions;

export default adminProductsSlice.reducer;
