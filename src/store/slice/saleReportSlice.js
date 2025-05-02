// store/saleReportSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchsaleReportByDate,
  fetchsaleReportByInvoice,
  fetchsaleReportDetail,
} from "../thunk/saleReportThunk";

const initialState = {
  reports: [],
  currentPage: 0,
  totalPages: 0,
  loading: false,
  error: null,
  selectedReport: null,
};

const saleReportSlice = createSlice({
  name: "saleReport",
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
      .addCase(fetchsaleReportByDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchsaleReportByDate.fulfilled, (state, action) => {
        state.reports = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchsaleReportByDate.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchsaleReportByInvoice.fulfilled, (state, action) => {
        state.reports = [action.payload];
      })
      .addCase(fetchsaleReportDetail.fulfilled, (state, action) => {
        state.selectedReport = action.payload;
      });
  },
});

export const { setCurrentPage, clearSelectedReport } = saleReportSlice.actions;
export default saleReportSlice.reducer;
