import { useContext } from "react";
import UserContext from "../context/UserContext";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaIdBadge } from "react-icons/fa";

export default function Profile() {
  const { user } = useContext(UserContext);
  console.log("Profile User:", user);

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "600px", borderRadius: "1rem" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-muted">User ID: {user.id}</p>
        </div>

        {user.id ? (
          <Row className="text-start px-3">
            <Col xs={12} className="mb-3">
              <FaIdBadge className="me-2 text-primary" />
              <strong>First Name:</strong> {user.firstName}
            </Col>
            <Col xs={12} className="mb-3">
              <FaIdBadge className="me-2 text-primary" />
              <strong>Last Name:</strong> {user.lastName}
            </Col>
            <Col xs={12} className="mb-3">
              <FaEnvelope className="me-2 text-primary" />
              <strong>Email:</strong> {user.email}
            </Col>
            <Col xs={12} className="mb-3">
              <FaPhone className="me-2 text-primary" />
              <strong>Mobile Number:</strong> {user.mobileNo}
            </Col>
          </Row>
        ) : (
          <p className="text-center text-danger">No user details available.</p>
        )}
      </Card>
    </Container>
  );
}
