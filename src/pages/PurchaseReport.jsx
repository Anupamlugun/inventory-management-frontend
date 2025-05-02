// PurchaseReport.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  clearSelectedReport,
} from "../store/slice/purchaseReportSlice";
import {
  fetchPurchaseReportByDate,
  fetchPurchaseReportByInvoice,
  fetchPurchaseReportDetail,
} from "../store/thunk/purchaseReportThunk";

import { fetchProductDetailsByProId } from "../store/thunk/productThunks";

import { Form, Button, Table, Spinner, Row, Col } from "react-bootstrap";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const PurchaseReport = () => {
  const dispatch = useDispatch();
  const { reports, currentPage, totalPages, loading, error, selectedReport } =
    useSelector((state) => state.purchaseReport);

  console.log("reports", reports);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
    },
  });

  const dates = watch();

  useEffect(() => {
    dispatch(
      fetchPurchaseReportByDate({
        startDate: dates.fromDate,
        endDate: dates.toDate,
        page: currentPage,
      })
    );
  }, [currentPage, dates.fromDate, dates.toDate, dispatch]);

  const handleSearch = debounce((invoiceNumber) => {
    if (invoiceNumber) {
      dispatch(fetchPurchaseReportByInvoice(invoiceNumber));
    }
  }, 500);

  const [productDetailId, setProductDetailId] = useState(null);

  const handleViewDetail = (id) => {
    dispatch(fetchPurchaseReportDetail(id));
    setProductDetailId(id);
  };

  return (
    <div className="container mt-5">
      {!selectedReport ? (
        <>
          <h2 className="mb-4 text-center text-primary fw-bold">
            Purchase Report
          </h2>

          <Form
            onSubmit={handleSubmit((data) => {
              dispatch(setCurrentPage(0));
              dispatch(
                fetchPurchaseReportByDate({
                  startDate: data.fromDate,
                  endDate: data.toDate,
                  page: 0,
                })
              );
            })}
          >
            <Row className="g-3 mb-4 bg-light p-4 rounded shadow-sm border">
              <Col md={4}>
                <Form.Label className="fw-bold">From Date:</Form.Label>
                <Form.Control type="date" {...register("fromDate")} required />
              </Col>
              <Col md={4}>
                <Form.Label className="fw-bold">To Date:</Form.Label>
                <Form.Control type="date" {...register("toDate")} required />
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button type="submit" className="w-100 fw-semibold">
                  Filter
                </Button>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-100 fw-semibold"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Search Invoice:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Invoice Number"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Form.Group>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <div className="table-responsive bg-white p-4 rounded shadow-sm border">
                <Table bordered striped className="text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Purchase Invoice</th>
                      <th>Date</th>
                      <th>Grand Total</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!reports[0] == "" &&
                      reports.map((report) => (
                        <tr key={report.id}>
                          <td>{report.purchaseInvoice}</td>
                          <td>
                            {new Date(report.updatedAt).toLocaleDateString()}
                          </td>
                          <td>{report.grand_total}</td>
                          <td>
                            <Button
                              variant="link"
                              onClick={() => handleViewDetail(report.id)}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                className="text-primary"
                              />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-primary"
                  disabled={currentPage === 0}
                  onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                >
                  Previous Page
                </Button>
                <span>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline-primary"
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                >
                  Next Page
                </Button>
              </div>
            </>
          )}
        </>
      ) : (
        <ReportDetails
          report={reports.find((r) => r.id === productDetailId)}
          selectedReport={selectedReport}
          onClose={() => {
            dispatch(clearSelectedReport());
          }}
        />
      )}
    </div>
  );
};

const ReportDetails = ({ report, selectedReport, onClose }) => {
  const dispatch = useDispatch();

  const [productDetails, setProductDetails] = useState([]);

  console.log("report after", report);
  console.log("productDetails", productDetails);
  console.log("selectedReport", selectedReport);

  useEffect(() => {
    if (selectedReport && selectedReport.length > 0) {
      selectedReport.forEach((product) => {
        dispatch(fetchProductDetailsByProId(product.product_Id)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            console.log("Product details fetched successfully:", res.payload);
            console.log("product", product);
            setProductDetails((prev) => [
              ...prev,
              {
                ...product,
                categoryName: res.payload.category_name,
                productName: res.payload.product_name,
              },
            ]);
          } else {
            console.error(
              "Failed to fetch product details:",
              res.error.message
            );
          }
        });
      });
    }
  }, [selectedReport, dispatch]);

  if (!report) {
    onClose();
    return <div className="alert alert-danger">No report found.</div>;
  }

  return (
    <>
      <Button variant="outline-secondary" className="mb-4" onClick={onClose}>
        Back to Report List
      </Button>

      <h2 className="text-center text-primary fw-bold mb-4">
        Purchase Report Details
      </h2>

      <div className="table-responsive bg-white p-4 rounded shadow-sm border">
        <h4 className="text-dark fw-semibold">Purchase Summary</h4>
        <Table bordered className="text-center">
          <thead className="table-dark">
            <tr>
              <th>Purchase Invoice</th>
              <th>Supplier Name</th>
              <th>Date</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{report.purchaseInvoice}</td>
              <td>{report.supplier_name}</td>
              <td>{new Date(report.updatedAt).toLocaleDateString()}</td>
              <td>{report.grand_total}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="table-responsive bg-white p-4 rounded shadow-sm border mt-4">
        <h4 className="text-dark fw-semibold">Purchased Products</h4>
        <Table bordered className="text-center">
          <thead className="table-dark">
            <tr>
              <th>Category Name</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {productDetails?.map((product, index) => {
              return (
                <tr key={index}>
                  <td>{product.categoryName}</td>
                  <td>{product.productName}</td>
                  <td>{product.item_qty}</td>
                  <td>{product.item_total_price}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default PurchaseReport;
