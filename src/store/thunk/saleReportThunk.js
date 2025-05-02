import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

export const fetchsaleReportByDate = createAsyncThunk(
  "saleReport/fetchByDate",
  async ({ startDate, endDate, page = 0, size = 5 }) => {
    const response = await baseAxios.get(
      `${API_ENDPOINTS.ORDER_SALE}/getsalesreport?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`
    );
    return response.data;
  }
);

export const fetchsaleReportByInvoice = createAsyncThunk(
  "saleReport/fetchByInvoice",
  async (bill) => {
    const response = await baseAxios.get(
      `${API_ENDPOINTS.ORDER_SALE}/sale?bill=${bill}`
    );
    return response.data;
  }
);

export const fetchsaleReportDetail = createAsyncThunk(
  "saleReport/fetchDetail",
  async (id) => {
    const response = await baseAxios.get(
      `${API_ENDPOINTS.ORDER_SALE}/getsalesreport/${id}`
    );
    return response.data;
  }
);
