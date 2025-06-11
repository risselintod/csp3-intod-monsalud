import { Card, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';

export default function CardProduct({product, user, handleToggleProduct}) {
    const navigate = useNavigate();

    return (
        <>
            <Card className="h-100 shadow p-4" onClick={() => navigate(`/product/${product._id}`)}>
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
        </>
    )
}