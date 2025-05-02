import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { baseAxios } from "../api/axiosBase";
import { API_ENDPOINTS } from "../api/endpoints";

const schema = yup.object().shape({
  fullname: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Register = () => {
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
        API_ENDPOINTS.AUTH + "/api/auth/register",
        data
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error("Login error:", error.response.status);

      if (error.response.status === 400) {
        // Set form-level error if login fails
        setError("email", {
          type: "manual",
          message: "This email Id is already registerd",
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
          <h2 className="text-center mb-4">Register</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                isInvalid={!!errors.fullname}
                {...register("fullname")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

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
              {isSubmitting ? "Registering..." : "Register"}
            </Button>

            <div className="text-center">
              <Link to="/login" className="btn btn-link">
                Already have an account? Login
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
