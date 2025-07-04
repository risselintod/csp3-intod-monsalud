import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = (products) => {
  console.log("HOME PRODUCTS:", products);
  
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-dark text-white text-center py-5">
        <Container>
          <h1 className="display-4">Welcome to Shoppable </h1>
          <p className="lead">Beautifull products </p>
          <Link className="btn btn-warning" size="lg" to={`/products`}>
            Shop Now
          </Link>
        </Container>
      </div>

      {/* Categories Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Shop by Category</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src="/home-decor.jpg" />
              <Card.Body className="text-center">
                <Card.Title>Home Decor</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src="/accessories.jpeg" />
              <Card.Body className="text-center">
                <Card.Title>Accessories</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src="/gifts.jpeg" />
              <Card.Body className="text-center">
                <Card.Title>Gifts</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Featured Products */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <Row>
          {[1, 2, 3, 4].map((item) => (
            <Col md={3} sm={6} xs={12} key={item} className="mb-4">
              {/* <CardProduct /> */}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
