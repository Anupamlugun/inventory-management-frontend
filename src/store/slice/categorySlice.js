// Slice definition encapsulating state and reducers for categories
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  fetchCategoriesPage,
  saveCategory,
  updateCategory,
} from "../thunk/CategoryThunk";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    listWithpage: [],
    pageNumber: 0,
    pageSize: 5,
    totalElements: null,
    totalPages: null,
    loading: false,
    error: null,
  },
  reducers: {
    // placeholder for synchronous reducers if needed in future sprints
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories lifecycle
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCategoriesPage lifecycle
      .addCase(fetchCategoriesPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesPage.fulfilled, (state, action) => {
        state.loading = false;
        state.pageNumber = action.payload.pageable.pageNumber;
        state.pageSize = action.payload.pageable.pageSize;
        state.listWithpage = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCategoriesPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // saveCategory lifecycle
      .addCase(saveCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateCategory lifecycle
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((c) => c.id === action.meta.arg.id);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], ...action.meta.arg.category };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
