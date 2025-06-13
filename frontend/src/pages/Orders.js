import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import UserContext from "../context/UserContext";

const Orders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user.id) return setLoading(false);

    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.REACT_APP_API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        const ordersData = res.data;

        // Get all unique productIds
        const productIds = [...new Set(ordersData.flatMap((order) => order.productsOrdered.map((p) => p.productId)))];

        // Fetch product details
        const productDetails = await Promise.all(
          productIds.map(
            (id) =>
              axios
                .get(`${process.env.REACT_APP_API_URL}/products/${id}`)
                .then((res) => res.data)
                .catch(() => null) // fail silently
          )
        );

        // Map productId => product detail
        const productMap = {};
        productDetails.forEach((prod) => {
          if (prod && prod._id) {
            productMap[prod._id] = prod;
          }
        });

        // Merge product info into orders
        const enrichedOrders = ordersData.map((order) => ({
          ...order,
          productsOrdered: order.productsOrdered.map((item) => ({
            ...item,
            product: productMap[item.productId],
          })),
        }));

        setOrders(enrichedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load order history.");
        setLoading(false);
      });
  }, [user]);

  if (!user.id) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">Please login to view your order history.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">My Orders</h2>
      {orders.map((order, index) => (
        <Card key={order._id || index} className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>Order #{order._id}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Ordered on: {new Date(order.orderedOn).toLocaleString()}
            </Card.Subtitle>

            <Row className="mb-3">
              {order.productsOrdered.map((item, i) => (
                <Col md={6} key={i}>
                  <p className="mb-1">
                    <strong>{item.product?.name || "Unknown Product"}</strong>
                  </p>
                  <p className="mb-1">Qty: {item.quantity}</p>
                  <p className="mb-1">Subtotal: ₱{item.subtotal}</p>
                </Col>
              ))}
            </Row>

            <h5 className="text-end">Total: ₱{order.totalPrice}</h5>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Orders;
