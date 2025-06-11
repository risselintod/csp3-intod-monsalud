import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Notyf } from "notyf";
import { Navigate, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const notyf = new Notyf();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log(mobileNo);
  console.log(password);
  console.log(confirmPassword);

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      mobileNo.length === 11
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  function registerUser(user) {
    user.preventDefault();

    fetch("http://localhost:4000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Register User: ", data);

        if (data.message === "Registered Successfully") {
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword("");
          setConfirmPassword("");

          notyf.success("User Registered Successfully!");
          navigate(`/login`, {});
        } else if (data.message === "Mobile number invalid") {
          notyf.error("Mobile Number must be 11 digits");
        } else if (data.message === "Password must be at least 8 characters") {
          notyf.error("Password must be at least 8 characters");
        } else if (data.message === "Email invalid") {
          notyf.error("Please enter a valid Email");
        } else if (data.message === "Please enter your complete name") {
          notyf.error("Please enter your complete name");
        } else if (data.errorCode === 11000) {
          notyf.error("User already exist!");
        } else {
          notyf.error("Something went wrong!");
        }
      });
  }

  return (
    <Form className="p-5 m-5 bg-dark text-white" onSubmit={(e) => registerUser(e)}>
      <Row>
        <Col md="8" className="mx-auto">
          <h1 className="text-center my-5">Registration Form</h1>
          <Form.Group>
            <Form.Label>First Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              className="mb-3"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              required
            />

            <Form.Label>Last Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              className="mb-3"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              required
            />

            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your email"
              className="mb-3"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />

            <Form.Label>Mobile Number:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter your 11 digits mobile number"
              className="mb-3"
              value={mobileNo}
              onChange={(e) => {
                setMobileNo(e.target.value);
              }}
              required
            />

            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your password"
              className="mb-3"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />

            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your password to verify"
              className="mb-3"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />

            {isActive ? (
              <Button className="mt-3 px-5" type="submit" variant="success">
                Submit
              </Button>
            ) : (
              <Button className="mt-3 px-5" type="submit" variant="primary" disabled>
                Submit
              </Button>
            )}
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}
