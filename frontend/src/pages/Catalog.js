import { useEffect, useState, useContext } from "react";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import axios from "axios";
import UserContext from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddProductModal from "../components/AddProductModal";
import CardProduct from "../components/CardProduct";

export default function Catalog() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  console.log("PRODUTS: ", products);
  

  const fetchProducts = () => {
    const endpoint = user.isAdmin ? `${process.env.REACT_APP_API_URL}/products/all` : `${process.env.REACT_APP_API_URL}/products/active`;

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
        `${process.env.REACT_APP_API_URL}/products/${productId}/${action}`,
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
      <Container className="p-5 m-5 bg-dark text-white text-center">
        <h3>Please login first to view products.</h3>
      </Container>
    );
  }

  return (
    <>
      <Container className="p-5 bg-dark m-5">
        <h1 className="text-center pb-3 text-white">Products</h1>

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
                <CardProduct product={product} user={user} handleToggleProduct={handleToggleProduct} />
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
