// src/store/profitSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchProfitData } from "../thunk/profitThunk";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const profitSlice = createSlice({
  name: "profit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfitData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfitData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfitData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profitSlice.reducer;
