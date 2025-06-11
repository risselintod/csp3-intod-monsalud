import { useEffect, useState, useContext } from "react";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import axios from "axios";
import UserContext from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddProductModal from "../components/AddProductModal";

export default function Catalog() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  console.log("PRODUTS: ", products);
  

  const fetchProducts = () => {
    const endpoint = user.isAdmin ? "http://localhost:4000/products/all" : "http://localhost:4000/products/active";

    axios
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    if (user.id) {
      fetchProducts();
    }
  }, [user]);

  const handleToggleProduct = (productId, isActive) => {
    const action = isActive ? "archive" : "activate";
    axios
      .patch(
        `http://localhost:4000/products/${productId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        Swal.fire(`Product ${action}d!`, "", "success");
        fetchProducts();
      })
      .catch(() => {
        Swal.fire("Error", `Unable to ${action} product`, "error");
      });
  };

  const handleAddProduct = () => {
    navigate("/admin/add-product"); // 🔁 Make sure this route exists
  };

  if (!user.id) {
    return (
      <Container className="p-5 m-5 bg-warning text-center">
        <h3>Please login first to view products.</h3>
      </Container>
    );
  }

  return (
    <>
      <Container className="p-5 bg-info m-5">
        <h1 className="text-center pb-3">Products</h1>

        {/* 🔧 Admin Add Product Button */}
        {user.isAdmin && (
          <div className="text-end mb-4">
            <Button
              variant="success"
              onClick={() => {
                setShowModal(true);
              }}
            >
              ➕ Add Product
            </Button>
          </div>
        )}

        <Row className="mx-auto">
          {products.length > 0 ? (
            products.map((product) => (
              <Col md={4} key={product._id} className="mb-4">
                <Card className="h-100 shadow" onClick={() => navigate(`/product/${product._id}`)}>
                  <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Card.Img
                      variant="top"
                      src={product.imageUrl || `https://localhost:3000/products/public?name=${product.name}`}
                      alt={product.name}
                    />
                  </Link>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <Card.Text className="fw-bold">₱{product.price}</Card.Text>

                    {/* 🛠 Admin Toggle Button Only */}
                    {user.isAdmin ? (
                      <Button
                        variant={product.isActive ? "danger" : "success"}
                        className="w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleProduct(product._id, product.isActive);
                        }}
                      >
                        {product.isActive ? "Archive" : "Activate"}
                      </Button>
                    ) : (
                      <Button
                        variant="primary fixed"
                        className="w-100"
                        onClick={() => navigate(`/product/${product._id}`, {})}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <h4>No products available.</h4>
            </Col>
          )}
        </Row>
      </Container>
      <AddProductModal show={showModal} handleClose={handleCloseModal} onProductAdded={fetchProducts} />
    </>
  );
}
