import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Notyf } from "notyf";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const notyf = new Notyf();
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false); // default to false

  function authenticate(e) {
    e.preventDefault();

    fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
          navigate("/", {});
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
    fetch("http://localhost:4000/users/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    <Form className="p-5 m-5 bg-info" onSubmit={authenticate}>
      <Row>
        <Col md="8" className="mx-auto">
          <h1 className="text-center my-5">Login Form</h1>
          <Form.Group className="pb-5">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              className="mb-3"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password" // ✅ Changed to password
              placeholder="Enter your password"
              className="mb-3"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button className="mt-3 px-5" type="submit" variant={isActive ? "success" : "primary"} disabled={!isActive}>
              Login
            </Button>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}
