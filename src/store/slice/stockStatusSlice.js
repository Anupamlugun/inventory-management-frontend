// src/store/stockStatusSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchLowStock, fetchOutOfStock } from "../thunk/stockStatusThunk";

const initialState = {
  lowStock: {
    data: [],
    loading: false,
    error: null,
  },
  outOfStock: {
    data: [],
    loading: false,
    error: null,
  },
};

const stockStatusSlice = createSlice({
  name: "stockStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLowStock.pending, (state) => {
        state.lowStock.loading = true;
        state.lowStock.error = null;
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.lowStock.loading = false;
        state.lowStock.data = action.payload;
      })
      .addCase(fetchLowStock.rejected, (state, action) => {
        state.lowStock.loading = false;
        state.lowStock.error = action.payload;
      })
      .addCase(fetchOutOfStock.pending, (state) => {
        state.outOfStock.loading = true;
        state.outOfStock.error = null;
      })
      .addCase(fetchOutOfStock.fulfilled, (state, action) => {
        state.outOfStock.loading = false;
        state.outOfStock.data = action.payload;
      })
      .addCase(fetchOutOfStock.rejected, (state, action) => {
        state.outOfStock.loading = false;
        state.outOfStock.error = action.payload;
      });
  },
});

export default stockStatusSlice.reducer;
