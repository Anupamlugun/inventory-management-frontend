// Async thunk for REST endpoints
import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";

export const fetchDashboardMetrics = createAsyncThunk(
  "dashboard/fetchMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const endpoints = [
        { url: "/supplierstock/updatestockstatus", key: "stockStatus" },
        { url: "/productcategory/gettotalproducts", key: "totalProducts" },
        { url: "/supplierstock/gettotalprofit", key: "totalProfit" },
        {
          url: "/supplierstock/gettopandleastproduct",
          key: "topLeastProducts",
        },
      ];
      const responses = await Promise.all(
        endpoints.map((ep) => baseAxios.get(ep.url))
      );
      const data = {};
      responses.forEach((res, idx) => {
        const key = endpoints[idx].key;
        data[key] = res.data;
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);
