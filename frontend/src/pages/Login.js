import { useState, useEffect, useContext } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { Notyf } from "notyf";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import "notyf/notyf.min.css";

export default function Login() {
  const navigate = useNavigate();
  const notyf = new Notyf();
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  function authenticate(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem("token", data.access);
          retrieveUserDetails(data.access);
          setEmail("");
          setPassword("");
          notyf.success("Successful Login");
          navigate("/");
        } else if (data.message === "Incorrect email or password") {
          notyf.error("Incorrect Credentials. Try Again");
        } else {
          notyf.error("User Not Found. Try Again.");
        }
      })
      .catch((err) => {
        console.error("Login Error:", err);
        notyf.error("Server Error. Try again later.");
      });
  }

  function retrieveUserDetails(token) {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin,
        });
      });
  }

  useEffect(() => {
    setIsActive(email !== "" && password !== "");
  }, [email, password]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f8f9fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <Container className="p-0 m-0 d-flex justify-content-center">
        <Card
          className="shadow-lg p-4 w-100"
          style={{
            maxWidth: "400px",
            borderRadius: "1rem",
            backgroundColor: "#ffffff",
          }}
        >
          <h2 className="text-center mb-4 text-primary">Log In to Your Account</h2>
          <Form onSubmit={authenticate}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                variant={isActive ? "primary" : "secondary"}
                type="submit"
                disabled={!isActive}
                size="lg"
              >
                Login
              </Button>
            </div>
          </Form>

          <p className="text-center mt-4 text-muted" style={{ fontSize: "0.9rem" }}>
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </Card>
      </Container>
    </div>
  );
}
