import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../context/UserContext";
import { Container, Table, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.id) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:4000/cart/get-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(async (res) => {
        const rawItems = res.data.cartItems || [];

        const detailedItems = await Promise.all(
          rawItems.map(async (item) => {
            try {
              const productRes = await axios.get(`http://localhost:4000/products/${item.productId}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              return {
                ...item,
                product: productRes.data,
              };
            } catch (err) {
              console.error("Failed to fetch product", err);
              return null;
            }
          })
        );

        setCartItems(detailedItems.filter(Boolean));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load cart.");
        setLoading(false);
      });
  }, [user]);

  const updateQuantity = (productId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );

    const updatedItem = cartItems.find((item) => item.product._id === productId);
    const newQuantity = Math.max(1, updatedItem.quantity + delta);

    axios
      .patch(
        "http://localhost:4000/cart/update-cart-quantity",
        { productId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        // Optional: add toast or success indicator
      })
      .catch((err) => {
        console.error("Failed to update quantity:", err);

        // Optionally revert UI if needed
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.product._id === productId ? { ...item, quantity: updatedItem.quantity } : item))
        );

        alert("Failed to update quantity. Please try again.");
      });
  };

  const handleRemove = (productId) => {
    axios
      .patch(
        `http://localhost:4000/cart/${productId}/remove-from-cart`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
      })
      .catch((err) => {
        console.error("Failed to remove item:", err);
        alert("Failed to remove item from cart.");
      });
  };

  const handleClearCart = () => {
    axios
      .put(
        "http://localhost:4000/cart/clear-cart",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setCartItems([]);
      })
      .catch((err) => {
        console.error("Failed to clear cart:", err);
        alert("Failed to clear cart.");
      });
  };

  const handleCheckout = () => {
    axios
      .post(
        "http://localhost:4000/orders/checkout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        alert("Checkout successful!");
        setCartItems([]);
        navigate("/orders", {});
      })
      .catch((err) => {
        console.error(err);
        alert("Checkout failed.");
      });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!user.id) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning">Please login to view your cart.</Alert>
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
      <Container className="mt-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Your Cart</h2>
      {cartItems.length === 0 ? (
        <Alert variant="info" className="text-center">
          Your cart is empty.
        </Alert>
      ) : (
        <>
          <Table bordered hover responsive>
            <thead className="table-dark text-center">
              <tr>
                <th>Product</th>
                <th>Price (₱)</th>
                <th>Quantity</th>
                <th>Subtotal (₱)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="text-center align-middle">
                  <td>{item.product.name}</td>
                  <td>{item.product.price}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => updateQuantity(item.product._id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </Button>{" "}
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.product._id, 1)}>
                      +
                    </Button>
                  </td>
                  <td>{item.product.price * item.quantity}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(item.product._id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: ₱{totalPrice.toFixed(2)}</h4>
            <div>
              <Button variant="danger" className="me-2" onClick={handleClearCart}>
                Clear Cart
              </Button>
              <Button variant="success" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
