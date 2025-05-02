// src/components/Stock.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStock } from "../store/thunk/stockThunk";
import { Table, Spinner, Alert } from "react-bootstrap";

const Stock = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.stock);

  useEffect(() => {
    dispatch(fetchStock());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5">
        Error loading stock data: {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-5">
      <div className="container-fluid">
        <h2 className="text-center text-primary fw-bold mb-4">
          Stock Overview
        </h2>
        <div className="table-responsive bg-white p-4 rounded shadow-sm border">
          <Table bordered striped className="text-center">
            <thead className="table-dark">
              <tr>
                <th>Category</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Purchased</th>
                <th>Sold</th>
                <th className="text-success">Stock Available</th>
              </tr>
            </thead>
            <tbody>
              {data.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.category_name}</td>
                  <td>{stock.product_name}</td>
                  <td>{stock.product_price}</td>
                  <td>{stock.purchase}</td>
                  <td>{stock.sale}</td>
                  <td>{stock.available}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Stock;
