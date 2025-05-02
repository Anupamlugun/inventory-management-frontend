// src/components/Profit.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfitData } from "../store/thunk/profitThunk";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.profit);

  useEffect(() => {
    dispatch(fetchProfitData());
  }, [dispatch]);

  return (
    <div className="container">
      <h2 className="text-center text-success my-4">Total Profit</h2>
      <Button onClick={() => navigate(-1)} className="mb-3">
        Back
      </Button>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger">
          Error loading profit data: {error.message || error.toString()}
        </Alert>
      )}

      {!loading && !error && (
        <Alert variant="success" id="profitdescription">
          {data ? (
            <>
              <h4 className="alert-heading">Financial Summary:</h4>
              <p className="mb-2">
                <strong>Total Purchased Amount:</strong> ₹
                {data.total_purchase_amount}
              </p>
              <p className="mb-2">
                <strong>Total Sales Amount:</strong> ₹{data.total_sale_amount}
              </p>
              <p className="mb-2">
                <strong>Gross Profit:</strong> ₹{data.total_profit}
              </p>
              <p className="mb-2">
                <strong>GST Deducted:</strong> ₹{data.gst_deduction}
              </p>
              <p className="display-4">
                <strong>Net Profit Earned:</strong> ₹
                {data.total_profit_after_gst}
              </p>
            </>
          ) : (
            <p className="text-muted">No financial data available.</p>
          )}
        </Alert>
      )}
    </div>
  );
};

export default Profit;
