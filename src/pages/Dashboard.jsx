import React from "react";
import { useEffect } from "react";
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

  useEffect(() => {
    // Kick off both HTTP + WS workflows
    dispatch(fetchDashboardMetrics());
    const teardown = initWebSocket(dispatch);

    return () => teardown();
  }, [dispatch]);

  if (error) {
    console.log(error);
    if (error === 401) {
      handleLogout();
    }
    return <div>Error: {error}</div>;
  }

  console.log(
    stockStatus,
    totalProducts,
    totalProfit,
    topProducts,
    leastProducts
  );

  return (
    <>
      <div className="container">
        <h2 className="text-center text-primary my-4 dashboard-title">
          Inventory Dashboard
        </h2>

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

        <div className="table-responsive bg-white p-4 rounded shadow-sm mt-4">
          <h4 className="text-dark">Top Selling Products</h4>
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
        </div>

        <div className="table-responsive bg-white p-4 rounded shadow-sm mt-4">
          <h4 className="text-dark">Least Selling Products</h4>
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
