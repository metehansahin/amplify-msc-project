import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Snackbar,
  Alert,
  FormControl,
  FormGroup,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";

require("dotenv").config();

const AddProductPage = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { name, price, description, stock } = product;

    // Check if all fields are filled
    if (!name || !price || !description || !stock) {
      setError("All fields are required.");
      return false;
    }

    // Check if the fields match the expected types
    if (typeof name !== "string") {
      setError("Name must be a valid string.");
      return false;
    }

    if (typeof description !== "string") {
      setError("Description must be a valid string.");
      return false;
    }

    if (isNaN(price) || typeof Number(price) !== "number") {
      setError("Price must be a valid number.");
      return false;
    }

    if (isNaN(stock) || typeof Number(stock) !== "number") {
      setError("Stock must be a valid number.");
      return false;
    }

    setError("");
    return true;
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.SERVER_URL}product`,
        product,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Product added successfully!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError("Failed to add product. Please try again.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
          padding: "0 24px",
        }}
      >
        <h1>Add A Product</h1>
        <FormControl
          component="form"
          onSubmit={addProduct}
          sx={{ width: "100%", maxWidth: "1200px" }}
        >
          <FormGroup>
            <TextField
              label="Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ marginTop: "20px" }}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </FormGroup>
        </FormControl>
        {error && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setError("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setError("")} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}
        {success && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setSuccess("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setSuccess("")} severity="success">
              {success}
            </Alert>
          </Snackbar>
        )}
      </Container>
    </React.Fragment>
  );
};

export default AddProductPage;
