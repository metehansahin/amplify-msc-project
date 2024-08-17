import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductIcon from "../components/ProductIcon";
import NavigationBar from "../components/NavigationBar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

require("dotenv").config();

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const getProducts = async () => {
    try {
      const response = await axios.get(`${process.env.SERVER_URL}product`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch products. Please try again.");
    }
  };

  const handleDeleteConfirmation = (productId) => {
    setProductToDelete(productId);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleSuccess = (successMessage) => {
    setSuccess(successMessage);
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${process.env.SERVER_URL}product/${productToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setProducts(
        products.filter((product) => product._id !== productToDelete)
      );
      setSuccess("Product deleted successfully!");
    } catch (error) {
      setError("Failed to delete product. Please try again.");
    } finally {
      setConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <React.Fragment>
      <NavigationBar />
      <h1>Products</h1>
      {products.map((product) => (
        <ProductIcon
          key={product._id}
          product={product}
          onDelete={handleDeleteConfirmation}
          onError={handleError}
          onSuccess={handleSuccess}
        />
      ))}
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

      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteProduct} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ProductsPage;
