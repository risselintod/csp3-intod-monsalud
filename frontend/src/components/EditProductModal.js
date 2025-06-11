import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const EditProductModal = ({ show, handleClose, refresh, product }) => {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price) {
      Swal.fire("All fieldsare required", "", "warning");
      return;
    }

    try {
      await axios.patch(`http://localhost:4000/products/${product._id}/update`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      Swal.fire("Product updated successfully!", "", "success");
      handleClose();
      refresh(); // refresh products in parent
    } catch (err) {
      Swal.fire("Error", "Failed to save product", "error");
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name*</Form.Label>
            <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description*</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price (₱)*</Form.Label>
            <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Image URL (optional)</Form.Label>
            <Form.Control type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success">
            Save Product
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
