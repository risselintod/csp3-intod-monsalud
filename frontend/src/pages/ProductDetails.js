import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert, Row, Col, FormControl } from "react-bootstrap";
import UserContext from "../context/UserContext";
import EditProductModal from "../components/EditProductModal";

const ProductDetails = () => {
  const { user } = useContext(UserContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState("");
  // const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  function fetchSpecificProduct() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Product not found.");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchSpecificProduct();
  }, [productId]);

  const handleQuantityChange = (type) => {
    setQuantity((prevQty) => {
      if (type === "decrease") return prevQty > 1 ? prevQty - 1 : 1;
      if (type === "increase") return prevQty + 1;
    });
  };

  const handleAddToCart = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/cart/add-to-cart`,
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        alert("Added to cart successfully!");
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
        alert("Failed to add to cart.");
      });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Container className="d-flex justify-content-center mt-5">
        <Card style={{ width: "28rem" }} className="shadow-lg">
          <Card.Img variant="top" src={product.imageUrl || "https://via.placeholder.com/500x300"} alt={product.name} />
          <Card.Body>
            <Card.Title className="fs-3">{product.name}</Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Card.Text className="fw-bold fs-5">₱{product.price}</Card.Text>

            {user.isAdmin ? (
              <Button
                variant="primary"
                className="w-100"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Edit Product
              </Button>
            ) : (
              <>
                <Row className="align-items-center mb-3">
                  <Col xs="auto">
                    <Button variant="outline-secondary" onClick={() => handleQuantityChange("decrease")}>
                      −
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <FormControl value={quantity} readOnly style={{ width: "60px", textAlign: "center" }} />
                  </Col>
                  <Col xs="auto">
                    <Button variant="outline-secondary" onClick={() => handleQuantityChange("increase")}>
                      +
                    </Button>
                  </Col>
                </Row>
                <Button variant="success" className="w-100" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
      <EditProductModal
        show={showModal}
        handleClose={handleCloseModal}
        refresh={fetchSpecificProduct}
        product={product}
      />
    </>
  );
};

export default ProductDetails;
