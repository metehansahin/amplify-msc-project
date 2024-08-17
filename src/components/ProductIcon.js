import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Button,
  useTheme,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { addToBasket } from "../redux/basket/actions";
import { useDispatch, useSelector } from "react-redux";

const ProductIcon = ({ product, onDelete, onError, onSuccess }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const [merchant, setIsMerchant] = useState(false);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const basketItems = useSelector((state) => state.basket.products);

  const handleEditClick = () => {
    navigate(`/update-product/${product._id}`);
  };

  const handleDeleteClick = () => {
    onDelete(product._id);
  };

  const handleAddToBasket = () => {
    const productInBasket = basketItems.find(
      (item) => item._id === product._id
    ) || { quantity: 0 };

    if (productInBasket.quantity + quantity <= product.stock) {
      const productToAdd = {
        ...product,
        quantity: quantity,
      };
      dispatch(addToBasket(productToAdd));
      onSuccess(`${quantity} ${product.name} added to cart`);
    } else {
      onError(
        `Cannot add more than available stock (${product.stock}), currently ${productInBasket.quantity} in basket`
      );
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const merchantStatus = localStorage.getItem("merchant") === "true";
    setIsMerchant(merchantStatus);
  }, [token, merchant]);

  useEffect(() => {
    if (product.stock === 0) {
      setIsOutOfStock(true);
    } else {
      setIsOutOfStock(false);
    }
  });

  return (
    <Card
      sx={{
        width: 345,
        display: "inline-block",
        margin: "10px",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardHeader
        title={product.name}
        sx={{ color: isOutOfStock ? "red" : theme.palette.primary.main }}
      />
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Typography
            variant="body1"
            sx={{ color: isOutOfStock ? "red" : theme.palette.text.primary }}
          >
            {product.description}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: isOutOfStock ? "red" : "green" }}
          >
            Price: ${product.price}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: isOutOfStock ? "red" : theme.palette.text.secondary }}
          >
            Stock: {product.stock}
          </Typography>
          {isOutOfStock ? (
            <Typography
              variant="body2"
              sx={{ color: "red", fontWeight: "bold" }}
            >
              Out of Stock
            </Typography>
          ) : (
            token &&
            !merchant && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={handleDecrement}
                    disabled={quantity === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{quantity}</Typography>
                  <IconButton
                    onClick={handleIncrement}
                    disabled={quantity === product.stock}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToBasket}
                  disabled={isOutOfStock}
                >
                  Add To Cart
                </Button>
              </Box>
            )
          )}
          {token && merchant && (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                marginTop: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductIcon;
