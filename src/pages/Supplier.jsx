import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, Button, Form, Table } from "react-bootstrap";
import {
  fetchSuppliers,
  saveSupplier,
  updateSupplier,
  deleteSupplier,
  fetchSupplierById,
} from "../store/thunk/supplierThunk";
import { useAuth } from "../hooks/useAuth";

import { clearSelectedSupplier } from "../store/slice/supplierSlice";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Invalid phone number"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  address: yup.string().required("Address is required"),
});

const Supplier = () => {
  const { list, loading, selectedSupplier, error } = useSelector(
    (state) => state.suppliers
  );
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { handleLogout } = useAuth();

  const [alert, setAlert] = React.useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSupplier) {
      setValue("name", selectedSupplier.name);
      setValue("phone", selectedSupplier.phone);
      setValue("email", selectedSupplier.email);
      setValue("address", selectedSupplier.address);
    }
  }, [selectedSupplier, setValue]);

  const onSubmit = async (data) => {
    const supplierData = {
      supplier_name: data.name,
      supplier_phone: data.phone,
      supplier_email: data.email,
      supplier_address: data.address,
    };

    try {
      if (selectedSupplier) {
        const response = await dispatch(
          updateSupplier({
            id: selectedSupplier.supplier_id,
            supplier: supplierData,
          })
        ).unwrap();

        if (response === "Your phone number or email ID already exists") {
          setAlert({
            show: true,
            message: "Your phone number or email ID already exists",
            variant: "danger",
          });

          setTimeout(() => setAlert({ ...alert, show: false }), 4000);
        } else {
          setAlert({
            show: true,
            message: "Supplier updated successfully",
            variant: "success",
          });
          setTimeout(() => setAlert({ ...alert, show: false }), 4000);
        }
      } else {
        const response = await dispatch(saveSupplier(supplierData)).unwrap();
        console.log(response);

        if (response === "Your phone number or email ID already exists") {
          setAlert({
            show: true,
            message: "Your phone number or email ID already exists",
            variant: "danger",
          });
          setTimeout(() => setAlert({ ...alert, show: false }), 4000);
        } else {
          setAlert({
            show: true,
            message: "Supplier added successfully",
            variant: "success",
          });
          setTimeout(() => setAlert({ ...alert, show: false }), 4000);
        }
      }
      reset();
      dispatch(fetchSuppliers());
      dispatch(clearSelectedSupplier());
    } catch (error) {
      setAlert({
        show: true,
        message: error || "Operation failed",
        variant: "danger",
      });
      setTimeout(() => setAlert({ ...alert, show: false }), 4000);
    }
  };

  const handleEdit = async (id) => {
    const response = await dispatch(fetchSupplierById(id));
    console.log(response.payload);
    if (response.payload) {
      setValue("name", response.payload.supplier_name);
      setValue("phone", response.payload.supplier_phone);
      setValue("email", response.payload.supplier_email);
      setValue("address", response.payload.supplier_address);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await dispatch(deleteSupplier(id)).unwrap();
        dispatch(fetchSuppliers());
        setAlert({
          show: true,
          message: "Supplier deleted successfully",
          variant: "success",
        });
        setTimeout(() => setAlert({ ...alert, show: false }), 4000);
      } catch (error) {
        setAlert({
          show: true,
          message: error || "Delete failed",
          variant: "danger",
        });
        setTimeout(() => setAlert({ ...alert, show: false }), 4000);
      }
    }
  };

  if (error) {
    if (error === 401) handleLogout();
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

      <div id="supplierSection" className="container-fluid mt-4">
        <h2 className="text-center mb-4 text-primary fw-bold">
          Supplier Management
        </h2>

        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card shadow-sm border rounded-3">
              <div className="card-body">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      {...register("name")}
                      isInvalid={!!errors.name}
                      placeholder="Enter supplier name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      {...register("phone")}
                      isInvalid={!!errors.phone}
                      placeholder="Enter phone number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control
                      type="email"
                      {...register("email")}
                      isInvalid={!!errors.email}
                      placeholder="Enter email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      {...register("address")}
                      isInvalid={!!errors.address}
                      placeholder="Enter address"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3 d-flex justify-content-center">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {selectedSupplier ? "Update Supplier" : "Add Supplier"}
                    </Button>
                    {selectedSupplier && (
                      <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={() => {
                          reset();
                          dispatch(clearSelectedSupplier());
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="card shadow-sm border rounded-3">
              <div className="card-header bg-primary text-white text-center fw-bold">
                Supplier List
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Name</th>
                        <th>Phone No</th>
                        <th>Email ID</th>
                        <th>Address</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((supplier) => (
                        <tr key={supplier.supplier_id}>
                          <td>{supplier.supplier_name}</td>
                          <td>{supplier.supplier_phone}</td>
                          <td>{supplier.supplier_email}</td>
                          <td>{supplier.supplier_address}</td>
                          <td>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(supplier.supplier_id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(supplier.supplier_id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supplier;
