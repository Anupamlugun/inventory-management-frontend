import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPurchaseCount,
  savePurchaseOrder,
  fetchPurchaseByInvoice,
} from "../thunk/purchaseOrderThunk";

const initialState = {
  purchaseOrders: [],
  purchaseItems: [],
  purchaseCount: 0,
  currentPurchase: null,
  loading: false,
  error: null,
};

const purchaseOrderSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    clearCurrentPurchase(state) {
      state.currentPurchase = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseCount.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseCount = action.payload;
      })
      .addCase(fetchPurchaseCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(savePurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders.push(action.payload);
      })
      .addCase(savePurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPurchaseByInvoice.fulfilled, (state, action) => {
        state.currentPurchase = action.payload;
      });
  },
});

export const { clearCurrentPurchase } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
