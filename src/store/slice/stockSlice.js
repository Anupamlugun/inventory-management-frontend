// src/store/stockSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchStock } from "../thunk/stockThunk";

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stockSlice.reducer;
