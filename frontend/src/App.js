import Container from "react-bootstrap/Container";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import Home from "./pages/Home";
import AppNavbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Orders from "./pages/Orders";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Container className="containerApp">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
