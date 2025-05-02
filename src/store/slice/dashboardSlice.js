import { createSlice } from "@reduxjs/toolkit";

import { fetchDashboardMetrics } from "../thunk/dashboardThunk";

const initialState = {
  stockStatus: { outOfStock: 0, lowOfStock: 0 },
  totalProducts: 0,
  totalProfit: 0,
  topProducts: [],
  leastProducts: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // WS-driven updates
    updateStockStatus: (state, action) => {
      state.stockStatus = action.payload;
    },
    updateTotalProducts: (state, action) => {
      state.totalProducts = action.payload;
    },
    updateTotalProfit: (state, action) => {
      state.totalProfit = action.payload.total_profit_after_gst;
    },
    updateTopLeast: (state, action) => {
      state.topProducts = action.payload.topProducts;
      state.leastProducts = action.payload.leastProducts;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.stockStatus = payload.stockStatus;
        state.totalProducts = payload.totalProducts;
        state.totalProfit =
          payload.totalProfit.total_profit_after_gst ?? payload.totalProfit;
        state.topProducts = payload.topLeastProducts.topProducts;
        state.leastProducts = payload.topLeastProducts.leastProducts;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const {
  updateStockStatus,
  updateTotalProducts,
  updateTotalProfit,
  updateTopLeast,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
