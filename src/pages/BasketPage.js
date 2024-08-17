import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Button,
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  Table,
  IconButton,
  Typography,
  Stack,
  Card,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NavigationBar from "../components/NavigationBar";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import LocalMallIcon from "@mui/icons-material/LocalMall";

import {
  addToBasket,
  removeFromBasket,
  updateProductStock,
  clearBasket,
} from "../redux/basket/actions";
import { useDispatch } from "react-redux";
import axios from "axios";

require("dotenv").config();

const BasketPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.basket.products);
  const totalCost = useSelector((state) => state.basket.totalCost);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    address: "",
  });
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (totalCost !== undefined) {
      setTotalAmount(`$${totalCost.toFixed(2)}`);
    }
  }, [totalCost, products]);

  useEffect(() => {
    const saveBasketToLocalStorage = () => {
      try {
        const serializedState = JSON.stringify({ products, totalCost });
        localStorage.setItem("basketState", serializedState);
      } catch (err) {
        setError("Could not save basket");
      }
    };

    saveBasketToLocalStorage();
  }, [products, totalCost]);

  const goToProducts = () => {
    navigate("/");
  };

  const handleRemoveFromBasket = (id) => {
    dispatch(removeFromBasket(id));
  };

  const handleAddToBasket = (item) => {
    const productToAdd = {
      ...item,
      quantity: 1,
    };
    dispatch(addToBasket(productToAdd));
  };

  const handleCheckout = async () => {
    if (!checkoutForm.name || !checkoutForm.address || products.length === 0) {
      setError(
        "Please fill in all fields and ensure you have products in your basket."
      );
    } else {
      setConfirm(true);
    }
  };

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setCheckoutForm({ ...checkoutForm, [name]: value });
  };

  const handleOrderFulfillment = async () => {
    const order = {
      userId: localStorage.getItem("userId"),
      name: checkoutForm.name,
      address: checkoutForm.address,
      totalCost: totalAmount,
      products: products.map((product) => ({
        productID: product._id,
        quantity: product.quantity,
      })),
    };

    setIsSubmitting(true);
    try {
      // Submit the order
      console.log(order);
      await axios.post(`${process.env.SERVER_URL}/order`, order);

      // Update the stock for each product in the order
      const updatedProducts = products.map(async (product) => {
        const newStock = product.stock - product.quantity;

        if (newStock >= 0) {
          await axios.put(
            `${process.env.SERVER_URL}/product/${product._id}`,
            {
              ...product,
              stock: newStock,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Update Redux store and local storage
          dispatch(updateProductStock(product._id, newStock));
        } else {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
      });

      // Wait for all product stock updates to complete
      await Promise.all(updatedProducts);

      // Clear the basket in Redux and local storage
      dispatch(clearBasket());
      localStorage.removeItem("basketState");

      // Display success message and redirect
      setSuccess("Order made successfully!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error(error);
      setError("Failed to confirm order and update stock. Please try again.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const handleConfirmClose = () => {
    setConfirm(false);
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <h1>Basket</h1>
      {products.length !== 0 ? (
        <>
          <Grid
            container
            direction="row"
            alignContent="center"
            justifyContent="center"
            sx={{ paddingTop: 5 }}
          >
            <Grid item xs={5}>
              <Paper
                elevation={3}
                sx={{
                  width: 550,
                }}
              >
                <Grid
                  container
                  alignContent="center"
                  alignItems="center"
                  justifyContent="center"
                >
                  <TableContainer
                    component={Paper}
                    sx={{
                      overflow: "scroll",
                      overflowX: "hidden",
                      maxHeight: 500,
                    }}
                  >
                    <Table sx={{ width: 550 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" sx={{ paddingLeft: 2 }}>
                            {" "}
                            Product
                          </TableCell>
                          <TableCell align="right" sx={{ paddingRight: 7 }}>
                            Price
                          </TableCell>{" "}
                          <TableCell align="center" sx={{ paddingRight: 8 }}>
                            Amount
                          </TableCell>{" "}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((item) => (
                          <TableRow
                            key={item._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              align="left"
                              sx={{ paddingLeft: 2 }}
                            >
                              {" "}
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={1}
                              >
                                <Typography variant="body1">
                                  {item.name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">${item.price}</TableCell>{" "}
                            <TableCell align="right">
                              {" "}
                              <Stack
                                direction="row"
                                gap={2}
                                sx={{ alignItems: "center" }}
                              >
                                <IconButton
                                  aria-label="add"
                                  size="medium"
                                  onClick={handleAddToBasket.bind(null, item)}
                                >
                                  <AddIcon fontSize="inherit" />
                                </IconButton>
                                <Typography variant="h5">
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  aria-label="remove"
                                  size="medium"
                                  onClick={handleRemoveFromBasket.bind(
                                    null,
                                    item._id
                                  )}
                                >
                                  <RemoveIcon fontSize="inherit" />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <br />
                <Card sx={{ backgroundColor: "#2196f3", maxWidth: 550 }}>
                  <Stack direction="row" justifyContent="space-around">
                    <Typography variant="h6" color="whitesmoke">
                      Total Cost:
                    </Typography>
                    <Typography variant="h6" color="whitesmoke">
                      {totalAmount}
                    </Typography>
                  </Stack>
                  <Stack direction="row"></Stack>
                </Card>
              </Paper>
            </Grid>
            <Grid item xs={5}>
              <Paper
                elevation={3}
                style={{
                  width: 500,
                  paddingTop: 5,
                }}
              >
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                  spacing={3}
                >
                  <Grid item>
                    <Typography variant="h5">Checkout</Typography>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      justifyContent="center"
                      gap={3}
                    >
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          alignItems="flexible"
                          alignContent="flexible"
                          justifyContent="flexible"
                          gap={2}
                        >
                          <Grid item>
                            <TextField
                              label="Name"
                              type="text"
                              sx={{ width: 230 }}
                              name="name"
                              value={checkoutForm.name || ""}
                              onChange={handleFormInput}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircle />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item>
                            <TextField
                              label="Address"
                              type="text"
                              name="address"
                              value={checkoutForm.address || ""}
                              onChange={handleFormInput}
                              sx={{ width: 230 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <HomeIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Button variant="contained" onClick={handleCheckout}>
                      Checkout
                    </Button>
                  </Grid>
                  <Grid item></Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid
            container
            direction="column"
            alignItems="center"
            alignContent="center"
            justifyContent="center"
            sx={{ paddingTop: 2 }}
          >
            <Grid item>
              <h2>Your basket is empty!</h2>
              <Button
                variant="contained"
                onClick={goToProducts}
                endIcon={<LocalMallIcon />}
              >
                Browse Products
              </Button>
            </Grid>
          </Grid>
        </>
      )}
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
        open={confirm} // Use 'confirm' to control the visibility of the dialog
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Order"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to fulfill this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleOrderFulfillment}
            disabled={isSubmitting}
            color="error"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default BasketPage;
