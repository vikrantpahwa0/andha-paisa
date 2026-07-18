// src/store/slices/product-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock data - will be replaced with API calls
let mockProducts = [
  {
    id: 1,
    name: "Amazon Gift Card",
    category: "Gift Cards",
    description: "₹500 Amazon Gift Card - Shop for anything on Amazon",
    pointsRequired: 500,
    stock: 25,
    expiryDate: "2026-12-31",
    tags: ["Popular", "Digital"],
    images: [
      "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Premium Headphones",
    category: "Electronics",
    description: "Wireless Bluetooth Headphones with Noise Cancellation",
    pointsRequired: 2000,
    stock: 8,
    expiryDate: null,
    tags: ["Electronics", "Premium"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Fetch all products
export const getProductsList = createAsyncThunk(
  "product/getList",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter out inactive products
      const activeProducts = mockProducts.filter(p => p.is_active !== false);
      return activeProducts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create or update product
export const createUpdateProduct = createAsyncThunk(
  "product/createUpdate",
  async (productData, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (productData.id) {
        // Update existing product
        const index = mockProducts.findIndex(p => p.id === productData.id);
        if (index === -1) {
          return rejectWithValue("Product not found");
        }

        // If is_active is false, soft delete
        if (productData.is_active === false) {
          mockProducts[index] = { ...mockProducts[index], is_active: false };
          return { 
            success: true, 
            message: "Product deleted successfully",
            data: { productId: productData.id }
          };
        }

        // Update product
        mockProducts[index] = {
          ...mockProducts[index],
          ...productData,
          updated_at: new Date().toISOString(),
        };
        return { 
          success: true, 
          message: "Product updated successfully",
          data: { productId: productData.id }
        };
      } else {
        // Create new product
        const newProduct = {
          ...productData,
          id: Date.now(),
          is_active: true,
          created_at: new Date().toISOString(),
        };
        mockProducts.push(newProduct);
        return { 
          success: true, 
          message: "Product created successfully",
          data: { productId: newProduct.id }
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
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
      // Create/Update Product
      .addCase(createUpdateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createUpdateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || "Product saved successfully";
      })
      .addCase(createUpdateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = productSlice.actions;
export default productSlice.reducer;