import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../store/slice/authSlice";
import { baseAxios } from "../api/axiosBase";
import { API_ENDPOINTS } from "../api/endpoints";
import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 67 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    clearErrors();
    setServerError(null);
    setIsNetworkError(false);

    try {
      const response = await baseAxios.post(
        API_ENDPOINTS.AUTH + "/api/auth/login",
        data,
        { timeout: 10000 }
      );

      dispatch(
        setCredentials({
          user: data.email,
          accesstoken: response.data.accessToken,
        })
      );
      navigate("/");
    } catch (error) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      // Handle network errors
      if (error.code === "ECONNABORTED") {
        setServerError("Request timed out. Please check your connection.");
        setIsNetworkError(true);
        return;
      }

      if (!error.response) {
        setServerError("Network error. Please check your internet connection.");
        setIsNetworkError(true);
        return;
      }

      // Handle specific error cases
      switch (status) {
        case 400:
          if (serverMessage?.includes("email")) {
            setError("email", { type: "server", message: serverMessage });
          }
          if (serverMessage?.includes("password")) {
            setError("password", { type: "server", message: serverMessage });
          }
          break;
        case 401:
          setServerError("Invalid email or password. Please try again.");
          break;
        case 403:
          setServerError("Account not verified. Please check your email.");
          break;
        case 429:
          setServerError("Too many attempts. Please try again later.");
          break;
        case 500:
          setServerError("Server error. Please try again later.");
          break;
        default:
          setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Login to Your Account</h2>

          {serverError && (
            <Alert variant="danger" className="d-flex align-items-center">
              <FiAlertCircle className="me-2" />
              {serverError}
              {isNetworkError && (
                <Button
                  variant="link"
                  className="p-0 ms-2"
                  onClick={handleSubmit(onSubmit)}
                >
                  Try again
                </Button>
              )}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                isInvalid={!!errors.email}
                {...register("email")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                isInvalid={!!errors.password}
                {...register("password")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                At least 6 characters required
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* <div className="text-center mt-3">
                <Link
                  to="/forgot-password"
                  className="text-decoration-none small"
                >
                  Forgot password?
                </Link>
              </div> */}

              <div className="text-center mt-4">
                <span className="text-muted">Don't have an account?</span>{" "}
                <Link to="/register" className="text-decoration-none">
                  Create account
                </Link>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
