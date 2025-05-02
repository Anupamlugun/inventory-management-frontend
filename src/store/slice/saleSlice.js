// store/slices/saleSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  saveSaleOrder,
  getSaleReport,
  getSaleDetail,
  getSaleByBill,
} from "../thunk/saleOrderThunk";

const initialState = {
  sales: [],
  saleItems: [],
  currentSale: null,
  loading: false,
  error: null,
};

const saleSlice = createSlice({
  name: "sale",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Save Sale Order
      .addCase(saveSaleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSaleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.sales.push(action.payload);
      })
      .addCase(saveSaleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Sales Report
      .addCase(getSaleReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaleReport.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(getSaleReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Sale Detail
      .addCase(getSaleDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaleDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.saleItems = action.payload;
      })
      .addCase(getSaleDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Sale by Bill
      .addCase(getSaleByBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaleByBill.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSale = action.payload;
      })
      .addCase(getSaleByBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default saleSlice.reducer;
