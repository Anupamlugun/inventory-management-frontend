import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

export const fetchPurchaseReportByDate = createAsyncThunk(
  "purchaseReport/fetchByDate",
  async ({ startDate, endDate, page = 0, size = 5 }) => {
    const response = await baseAxios.get(
      `${API_ENDPOINTS.ORDER_SALE}/getpurchasereport?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`
    );
    return response.data;
  }
);

export const fetchPurchaseReportByInvoice = createAsyncThunk(
  "purchaseReport/fetchByInvoice",
  async (invoiceNumber) => {
    const response = await baseAxios.get(
      `${API_ENDPOINTS.ORDER_SALE}/purchasereportbyinvoice?purchase_invoice=${invoiceNumber}`
    );
    return response.data;
  }
);

export const fetchPurchaseReportDetail = createAsyncThunk(
  "purchaseReport/fetchDetail",
  async (id) => {
    const response = await baseAxios.get(
      `${API_ENDPOINTS.ORDER_SALE}/getpurchasereport/${id}`
    );
    return response.data;
  }
);
