// src/components/OutOfStock.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutOfStock } from "../store/thunk/stockStatusThunk";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OutOfStock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state) => state.stockStatus.outOfStock
  );

  useEffect(() => {
    dispatch(fetchOutOfStock());
  }, [dispatch]);

  return (
    <div className="container">
      <h2 className="text-center text-warning my-4">Out of Stock Items</h2>
      <Button onClick={() => navigate(-1)} className="mb-3">
        Back
      </Button>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table hover bordered className="text-center">
          <thead className="table-dark">
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.category_name}</td>
                  <td>{item.available}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No out-of-stock items found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OutOfStock;
