import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategoriesPage,
  saveCategory,
  updateCategory,
} from "../store/thunk/categoryThunk";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Button, Alert } from "react-bootstrap";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  category_name: yup.string().required("Category is required"),
});

const Category = () => {
  const { listWithpage, pageNumber, pageSize, totalPages, error } = useSelector(
    (state) => state.category
  );
  const dispatch = useDispatch();
  const { handleLogout } = useAuth();
  const [categoryupdate, setCategoryupdate] = useState(false);

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
    dispatch(fetchCategoriesPage({ page: pageNumber, size: pageSize }));
  }, [dispatch, pageNumber, pageSize]);

  const handlePrevPage = () => {
    if (pageNumber > 0) {
      dispatch(fetchCategoriesPage({ page: pageNumber - 1, size: pageSize }));
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages - 1) {
      dispatch(fetchCategoriesPage({ page: pageNumber + 1, size: pageSize }));
    }
  };

  const handleEdit = (id, category) => {
    console.log(id, category);
    // Set the value for fields using setValue
    setValue("category_name", category);
    setValue("category_id", id);

    setCategoryupdate(true);
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);

    if (categoryupdate) {
      console.log(data.category_id, data);
      dispatch(
        updateCategory({
          id: data.category_id,
          category: data,
        })
      ).then((response) => {
        dispatch(fetchCategoriesPage({ page: pageNumber, size: pageSize }));

        console.log(response.payload);
        if (response.payload === "Category already exists") {
          setError("category_name", {
            type: "manual",
            message: "Category already exists",
          });
        } else if (response.payload === "Category updated successfully") {
          setAlert({
            show: true,
            message: "Category updated successfully",
            variant: "success",
          });

          setTimeout(() => {
            setAlert({ ...alert, show: false });
          }, 4000);
        }

        setCategoryupdate(false);
      });
    } else {
      dispatch(saveCategory(data)).then((response) => {
        dispatch(fetchCategoriesPage({ page: pageNumber, size: pageSize }));
        console.log(response.payload);
        if (response.payload === "Category already exists") {
          setError("category_name", {
            type: "manual",
            message: "Category already exists",
          });
        } else if (response.payload === "Category saved") {
          setAlert({
            show: true,
            message: "Category saved successfully!",
            variant: "success",
          });

          setTimeout(() => {
            setAlert({ ...alert, show: false });
          }, 4000);
        }
      });
    }
  };

  if (error) {
    if (error === 401) handleLogout();
    return <div>Error: {error.message || error}</div>;
  }

  console.log(categoryupdate);

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

      <div id="categorySection" className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <h2 className="text-center text-primary fw-bold">Category Form</h2>
            <Form
              className="mb-4 p-4 rounded bg-white shadow-sm border"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Form.Group className="mb-3">
                <Form.Label className="form-label fw-semibold">
                  Category Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={!!errors.category_name}
                  {...register("category_name")}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.category_name?.message}
                </Form.Control.Feedback>
                <input type="hidden" {...register("category_id")} />
              </Form.Group>

              {categoryupdate ? (
                <Button type="submit" className="btn btn-warning w-100">
                  Update Category
                </Button>
              ) : (
                <Button type="submit" className="btn btn-primary w-100">
                  Add Category
                </Button>
              )}
            </Form>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h2 className="text-center text-dark fw-bold">Category Details</h2>
            <div className="table-responsive rounded shadow-sm border">
              <table className="table table-hover table-bordered text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th className="py-3">Category Name</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listWithpage.map((category) => (
                    <tr key={category.categoryId}>
                      <td>{category.category_name}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() =>
                            handleEdit(
                              category.categoryId,
                              category.category_name
                            )
                          }
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

export default Category;
