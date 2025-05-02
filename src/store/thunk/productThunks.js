import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseAxios } from "../../api/axiosBase";
import { API_ENDPOINTS } from "../../api/endpoints";

export const fetchProductsPage = createAsyncThunk(
  "products/fetchPage",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/getproducts`,
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

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/getallproducts`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const fetchProductDetailsByProId = createAsyncThunk(
  "products/fetchDetailsByProId",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/getproductdetailsbyproid/${productId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const fetchProductsByCategoryAndType = createAsyncThunk(
  "products/fetchByCategoryAndType",
  async ({ category_id, purchase_sale }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/getproducts/${category_id}/${purchase_sale}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const saveProduct = createAsyncThunk(
  "products/save",
  async (product, { rejectWithValue }) => {
    try {
      const response = await baseAxios.post(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/saveproduct`,
        product
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (product_id, { rejectWithValue }) => {
    try {
      const response = await baseAxios.put(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/deleteproduct/${product_id}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (product_id, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/getproductbyid`,
        { params: { product_id } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ product_id, product }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.put(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/updateproducts/${product_id}`,
        product
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const fetchTotalProducts = createAsyncThunk(
  "products/fetchTotal",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/gettotalproducts`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchByCategory",
  async ({ categoryId, type }, { rejectWithValue }) => {
    try {
      const response = await baseAxios.get(
        `${API_ENDPOINTS.PRODUCT_CATEGORY}/getproducts/${categoryId}/${type}`
      );
      return { categoryId, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.response.status);
    }
  }
);
