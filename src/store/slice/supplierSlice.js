import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSuppliers,
  saveSupplier,
  updateSupplier,
  deleteSupplier,
  fetchSupplierById,
} from "../thunk/supplierThunk";

const initialState = {
  list: [],
  selectedSupplier: null,
  loading: false,
  error: null,
};

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    clearSelectedSupplier(state) {
      state.selectedSupplier = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSupplier.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state) => {
        state.loading = false;
        state.selectedSupplier = null;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.selectedSupplier = action.payload;
      });
  },
});

export const { clearSelectedSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;
