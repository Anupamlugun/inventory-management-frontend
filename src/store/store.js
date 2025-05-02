import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import dashboardReducer from "./slice/dashboardSlice";
import categoryReducer from "./slice/categorySlice";
import productReducer from "./slice/productSlice";
import supplierReducer from "./slice/supplierSlice";
import purchaseOrderReducer from "./slice/purchaseOrderSlice";
import saleReducer from "./slice/saleSlice";
import purchaseReducer from "./slice/purchaseReportSlice";
import saleReportReducer from "./slice/saleReportSlice";
import stockReducer from "./slice/stockSlice";
import stockStatusReducer from "./slice/stockStatusSlice";
import profitReducer from "./slice/profitSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    category: categoryReducer,
    products: productReducer,
    suppliers: supplierReducer,
    purchase: purchaseOrderReducer,
    sale: saleReducer,
    purchaseReport: purchaseReducer,
    saleReport: saleReportReducer,
    stock: stockReducer,
    stockStatus: stockStatusReducer,
    profit: profitReducer,
  },
});
