import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Supplier from "./pages/Supplier";
import PurchaseProduct from "./pages/PurchaseProduct";
import SaleProduct from "./pages/SaleProduct";
import PurchaseReport from "./pages/PurchaseReport";
import SaleReport from "./pages/SaleReport";
import Stock from "./pages/Stock";
import LowStock from "./components/LowStock";
import OutOfStock from "./components/OutOfStock";
import Profit from "./components/Profit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/out_of_stock" element={<OutOfStock />} />
            <Route path="/low_stock" element={<LowStock />} />
            <Route path="/total_profit" element={<Profit />} />
            <Route path="/category" element={<Category />} />
            <Route path="/product" element={<Product />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/purchase-product" element={<PurchaseProduct />} />
            <Route path="/sale-product" element={<SaleProduct />} />
            <Route path="/purchase-report" element={<PurchaseReport />} />
            <Route path="/sale-report" element={<SaleReport />} />
            <Route path="/stock" element={<Stock />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
