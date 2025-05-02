import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/getcategories`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const fetchCategoriesPage = createAsyncThunk(
  "categories/fetchPage",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/getcategoriespage`,
        {
          params: { page, size },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const saveCategory = createAsyncThunk(
  "categories/save",
  async (category, { rejectWithValue }) => {
    try {
      const response = await baseAxios.post(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/savecategory`,
        category
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, category }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.put(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/updatecategory/${id}`,
        category
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);
