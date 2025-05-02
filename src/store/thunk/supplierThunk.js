import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.SUPPLIER_STOCK}/getsupplier`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const saveSupplier = createAsyncThunk(
  "suppliers/save",
  async (supplier, { rejectWithValue }) => {
    try {
      const response = await baseAxios.post(
        `${API_ENDPOINTS.SUPPLIER_STOCK}/savesupplier`,
        supplier
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "suppliers/update",
  async ({ id, supplier }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.put(
        `${API_ENDPOINTS.SUPPLIER_STOCK}/updatesupplier/${id}`,
        supplier
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await baseAxios.put(
        `${API_ENDPOINTS.SUPPLIER_STOCK}/deletesupplier/${id}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const fetchSupplierById = createAsyncThunk(
  "suppliers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.SUPPLIER_STOCK}/getsupplierbyid/${id}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);
