import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

export const fetchStock = createAsyncThunk(
  "stock/fetchStock",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.SUPPLIER_STOCK}/stock`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
