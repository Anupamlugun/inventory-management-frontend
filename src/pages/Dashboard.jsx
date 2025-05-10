import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardMetrics } from "../store/thunk/dashboardThunk";
import { initWebSocket } from "../services/wsService";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    stockStatus,
    totalProducts,
    totalProfit,
    topProducts,
    leastProducts,
    error,
  } = useSelector((state) => state.dashboard);
  const { handleLogout } = useAuth();
  const wsTeardownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
    const teardown = initWebSocket(dispatch);
    wsTeardownRef.current = teardown;

    return () => {
      if (wsTeardownRef.current) {
        wsTeardownRef.current();
        wsTeardownRef.current = null;
      }
    };
  }, [dispatch]);

  const handleRetry = () => {
    // Clear existing WebSocket connection
    if (wsTeardownRef.current) {
      wsTeardownRef.current();
      wsTeardownRef.current = null;
    }
    // Re-fetch data and reinitialize WebSocket
    dispatch(fetchDashboardMetrics());
    const newTeardown = initWebSocket(dispatch);
    wsTeardownRef.current = newTeardown;
  };

  if (error) {
    console.error("Dashboard error:", error);

    if (error === 401) {
      handleLogout();
      return null;
    }

    const errorMessages = {
      403: "You don't have permission to view this data.",
      404: "Requested data not found.",
      500: "Server error. Please try again later.",
      503: "Service unavailable. Check your connection.",
    };

    const message = errorMessages[error] || "Failed to load dashboard data.";

    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Something went wrong</h4>
          <p>{message}</p>
          <button className="btn btn-primary mt-2" onClick={handleRetry}>
            Retry
          </button>
          <div className="mt-3">
            <small>
              If the problem continues, contact support at{" "}
              <a href="mailto:support@inventory.com">support@inventory.com</a>
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center text-primary my-4">Inventory Dashboard</h2>

      <div className="row text-center">
        <div className="col-md-3">
          <Link to="out_of_stock" className="text-decoration-none">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Out of Stock</h5>

                {stockStatus.outOfStock >= 0 ? (
                  <p id="out_of_stock" className="card-text display-6">
                    {stockStatus.outOfStock}
                  </p>
                ) : (
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="total_profit" className="text-decoration-none">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Profit</h5>

                {totalProfit >= 0 ? (
                  <p id="total_profit" className="card-text display-6">
                    ₹{totalProfit.toFixed(2)}
                  </p>
                ) : (
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="product#product_details" className="text-decoration-none">
            <div className="card text-white bg-info mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Products</h5>

                {totalProducts >= 0 ? (
                  <p id="total_products" className="card-text display-6">
                    {totalProducts}
                  </p>
                ) : (
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3">
          <Link to="low_stock" className="text-decoration-none">
            <div className="card text-white bg-danger mb-3">
              <div className="card-body">
                <h5 className="card-title">Low Stock</h5>

                {stockStatus.lowOfStock >= 0 ? (
                  <p id="low_stock" className="card-text display-6">
                    {stockStatus.lowOfStock}
                  </p>
                ) : (
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Top Selling Products Table */}
      <div className="table-responsive bg-white p-4 rounded shadow-sm mt-4">
        <h4 className="text-dark">Top Selling Products</h4>
        {topProducts?.length > 0 ? (
          <table className="table table-hover table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Sold Quantity</th>
              </tr>
            </thead>
            <tbody id="topSellingProductsTable">
              {topProducts &&
                topProducts.map((products, index) => {
                  return (
                    <tr key={index}>
                      <td>{products.product_name}</td>
                      <td>{products.category_name}</td>
                      <td>{products.sale}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info mb-0">
            No top selling products data available
          </div>
        )}
      </div>

      {/* Least Selling Products Table */}
      <div className="table-responsive bg-white p-4 rounded shadow-sm mt-4">
        <h4 className="text-dark">Least Selling Products</h4>
        {leastProducts?.length > 0 ? (
          <table className="table table-hover table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Sold Quantity</th>
              </tr>
            </thead>
            <tbody id="leastSellingProductsTable">
              {leastProducts &&
                leastProducts.map((products) => {
                  return (
                    <tr key={products.productId}>
                      <td>{products.product_name}</td>
                      <td>{products.category_name}</td>
                      <td>{products.sale}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info mb-0">
            No least selling products data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
