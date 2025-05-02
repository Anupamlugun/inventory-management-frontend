// store/thunk/saleOrderThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

// Save Sale Order
export const saveSaleOrder = createAsyncThunk(
  "sale/saveSaleOrder",
  async ({ saleData }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.post(
        `${API_ENDPOINTS.ORDER_SALE}/sale`,
        saleData,
        {}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response.status);
    }
  }
);

// Get Sales Report
export const getSaleReport = createAsyncThunk(
  "sale/getSaleReport",
  async ({ startDate, endDate, page, size }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.ORDER_SALE}/getsalesreport`,
        {
          params: {
            startDate,
            endDate,
            page,
            size,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response.status);
    }
  }
);

// Get Sale Details
export const getSaleDetail = createAsyncThunk(
  "sale/getSaleDetail",
  async (saleId, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.ORDER_SALE}/getsalesreport/${saleId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response.status);
    }
  }
);

// Get Sale by Bill Number
export const getSaleByBill = createAsyncThunk(
  "sale/getSaleByBill",
  async (billNumber, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(`${API_ENDPOINTS.ORDER_SALE}/sale`, {
        params: { bill: billNumber },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.response.status);
    }
  }
);
