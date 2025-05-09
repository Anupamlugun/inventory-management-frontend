import { useSelector, useDispatch } from "react-redux";
import {
  fetchProductsPage,
  saveProduct,
  updateProduct,
  deleteProduct,
} from "../store/thunk/productThunks";
import { fetchCategories } from "../store/thunk/categoryThunk";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Button, Alert } from "react-bootstrap";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
  productPrice: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  category: yup.string().required("Category is required"),
});

const Product = () => {
  const { paginatedList, pageNumber, pageSize, totalPages, error } =
    useSelector((state) => state.products);
  const { list: categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const { handleLogout } = useAuth();
  const [productUpdate, setProductUpdate] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    dispatch(fetchProductsPage({ page: pageNumber, size: pageSize }));
    dispatch(fetchCategories());
  }, [dispatch, pageNumber, pageSize]);

  const handlePrevPage = () => {
    if (pageNumber > 0) {
      dispatch(fetchProductsPage({ page: pageNumber - 1, size: pageSize }));
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages - 1) {
      dispatch(fetchProductsPage({ page: pageNumber + 1, size: pageSize }));
    }
  };

  const handleDelete = (product_id) => {
    dispatch(deleteProduct(product_id)).then((response) => {
      dispatch(fetchProductsPage({ page: pageNumber, size: pageSize }));

      if (response.payload === "Product is in stock, cannot delete") {
        setAlert({
          show: true,
          message: "Product is in stock, cannot delete",
          variant: "danger",
        });
        setTimeout(() => setAlert({ ...alert, show: false }), 4000);
        return;
      }

      setAlert({
        show: true,
        message: "Product deleted successfully",

        variant: "success",
      });
      setTimeout(() => setAlert({ ...alert, show: false }), 4000);
    });
  };

  const handleEdit = (product) => {
    setValue("productName", product.product_name);
    setValue("productPrice", product.product_price);
    setValue("category", product.categoryId);
    setValue("product_id", product.productId);
    setProductUpdate(true);
  };

  const onSubmit = (data) => {
    const productData = {
      product_name: data.productName,
      product_price: data.productPrice,
      categoryId: parseInt(data.category),
    };

    console.log(productData);

    if (productUpdate) {
      dispatch(
        updateProduct({ product_id: data.product_id, product: productData })
      ).then((response) => {
        handleResponse(response);
        setProductUpdate(false);
      });
    } else {
      dispatch(saveProduct(productData)).then(handleResponse);
    }
  };

  const handleResponse = (response) => {
    console.log(response.payload);
    if (response.payload === "Products already exist") {
      setError("productName", {
        type: "manual",
        message: "Products already exist",
      });
    } else if (response.payload == "Product saved successfully") {
      setAlert({
        show: true,
        message: "Product saved successfully",
        variant: "success",
      });

      dispatch(fetchProductsPage({ page: pageNumber, size: pageSize }));
      setTimeout(() => setAlert({ ...alert, show: false }), 4000);
    } else if (response.payload === "Product updated successfully") {
      setAlert({
        show: true,
        message: "Product updated successfully",
        variant: "success",
      });
      setTimeout(() => setAlert({ ...alert, show: false }), 4000);
    }
  };

  if (error) {
    if (error === 401) handleLogout();
    console.error("Error fetching products:", error);
    // Handle the error state here, e.g., show an alert or a message
    return <div>Error: {error.message || error}</div>;
  }

  return (
    <div className="container mt-5">
      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <div id="productSection" className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <h2 className="text-center text-primary fw-bold">Product Form</h2>
            <Form
              className="mb-4 p-4 rounded bg-white shadow-sm border"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Form.Group className="mb-3">
                <Form.Label>Category:</Form.Label>
                <Form.Select
                  isInvalid={!!errors.category}
                  {...register("category")}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product Name:</Form.Label>
                <Form.Control
                  isInvalid={!!errors.productName}
                  {...register("productName")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.productName?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product Price:</Form.Label>
                <Form.Control
                  type="number"
                  isInvalid={!!errors.productPrice}
                  {...register("productPrice")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.productPrice?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <input type="hidden" {...register("product_id")} />

              {productUpdate ? (
                <Button type="submit" className="btn btn-warning w-100">
                  Update Product
                </Button>
              ) : (
                <Button type="submit" className="btn btn-primary w-100">
                  Add Product
                </Button>
              )}
            </Form>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h2 className="text-center text-dark fw-bold">Product Details</h2>
            <div className="table-responsive rounded shadow-sm border">
              <table
                id="product_details"
                className="table table-hover table-bordered text-center align-middle"
              >
                <thead className="table-dark">
                  <tr>
                    <th>Category</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.category_name}</td>
                      <td>{product.product_name}</td>
                      <td>${product.product_price}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDelete(product.productId)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-primary"
                onClick={handlePrevPage}
                disabled={pageNumber === 0}
              >
                Prev Page
              </Button>
              <span className="my-auto">
                Page {pageNumber + 1} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                onClick={handleNextPage}
                disabled={pageNumber >= totalPages - 1}
              >
                Next Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
