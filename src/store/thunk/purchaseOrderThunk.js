import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

export const fetchPurchaseCount = createAsyncThunk(
  "purchase/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        API_ENDPOINTS.ORDER_SALE + "/getpurchasecount"
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const savePurchaseOrder = createAsyncThunk(
  "purchase/save",
  async (purchaseData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await baseAxios.post(
        API_ENDPOINTS.ORDER_SALE + "/savepurchaseorder",
        purchaseData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const fetchPurchaseByInvoice = createAsyncThunk(
  "purchase/fetchByInvoice",
  async (invoiceNumber, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await baseAxios.get(
        API_ENDPOINTS.ORDER_SALE + "/purchasereportbyinvoice",
        {
          params: { purchase_invoice: invoiceNumber },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);
