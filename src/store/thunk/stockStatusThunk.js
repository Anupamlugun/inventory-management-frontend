import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

export const fetchLowStock = createAsyncThunk(
  "stockStatus/fetchLowStock",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.SUPPLIER_STOCK}/getlistoflowstock`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOutOfStock = createAsyncThunk(
  "stockStatus/fetchOutOfStock",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.SUPPLIER_STOCK}/getListofoutofstock`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
