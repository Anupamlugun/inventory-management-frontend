// store/purchaseReportSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPurchaseReportByDate,
  fetchPurchaseReportByInvoice,
  fetchPurchaseReportDetail,
} from "../thunk/purchaseReportThunk";

const initialState = {
  reports: [],
  currentPage: 0,
  totalPages: 0,
  loading: false,
  error: null,
  selectedReport: null,
};

const purchaseReportSlice = createSlice({
  name: "purchaseReport",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseReportByDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseReportByDate.fulfilled, (state, action) => {
        state.reports = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchPurchaseReportByDate.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchPurchaseReportByInvoice.fulfilled, (state, action) => {
        state.reports = [action.payload];
      })
      .addCase(fetchPurchaseReportDetail.fulfilled, (state, action) => {
        state.selectedReport = action.payload;
      });
  },
});

export const { setCurrentPage, clearSelectedReport } =
  purchaseReportSlice.actions;
export default purchaseReportSlice.reducer;
