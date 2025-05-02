import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProductsPage,
  fetchProductDetailsByProId,
  fetchProductsByCategoryAndType,
  saveProduct,
  deleteProduct,
  fetchProductById,
  updateProduct,
  fetchTotalProducts,
  fetchAllProducts,
  fetchProducts,
} from "../thunk/productThunks";

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    paginatedList: [],
    productsByCategory: [],
    selectedProduct: null,
    pageNumber: 0,
    pageSize: 5,
    totalElements: null,
    totalPages: null,
    totalProducts: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products Page
      .addCase(fetchProductsPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsPage.fulfilled, (state, action) => {
        state.loading = false;
        state.paginatedList = action.payload.content;
        state.pageNumber = action.payload.pageable.pageNumber;
        state.pageSize = action.payload.pageable.pageSize;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProductsPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product Details by ID
      .addCase(fetchProductDetailsByProId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetailsByProId.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetailsByProId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Products by Category
      .addCase(fetchProductsByCategoryAndType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategoryAndType.fulfilled, (state, action) => {
        state.loading = false;
        state.productsByCategory = action.payload;
      })
      .addCase(fetchProductsByCategoryAndType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save Product
      .addCase(saveProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.meta.arg;
        state.paginatedList = state.paginatedList.filter(
          (p) => p.id !== productId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { product_id, product } = action.meta.arg;
        const index = state.paginatedList.findIndex((p) => p.id === product_id);
        if (index !== -1) {
          state.paginatedList[index] = {
            ...state.paginatedList[index],
            ...product,
          };
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Total Products
      .addCase(fetchTotalProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.totalProducts = action.payload;
      })
      .addCase(fetchTotalProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
