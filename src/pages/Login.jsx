import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../store/slice/authSlice";
import { baseAxios } from "../api/axiosBase";
import { API_ENDPOINTS } from "../api/endpoints";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await baseAxios.post(
        API_ENDPOINTS.AUTH + "/api/auth/login",
        data
      );
      console.log(response.data);
      console.log(response.data.accessToken);

      if (response) {
        dispatch(
          setCredentials({
            user: data.email,
            accesstoken: response.data.accessToken,
          })
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.response?.status);
      console.error("Login error:", error);

      if (error.code === "ECONNABORTED") {
        console.error("Request timed out");
        // Implement retry logic or notify the user
      } else {
        // Handle other errors
        console.error(error.message);
      }

      if (error.response?.status === 401) {
        // Set form-level error if login fails
        setError("email", {
          type: "manual",
          message: "Invalid email or password",
        });
        setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
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
                placeholder="Password"
                isInvalid={!!errors.password}
                {...register("password")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center">
              <Link to="/register" className="btn btn-link">
                Create new Account
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
