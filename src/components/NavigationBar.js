import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const [isMerchant, setIsMerchant] = useState(false); // Initialize as false

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const merchantStatus = localStorage.getItem("merchant") === "true"; // Convert to boolean
    setIsMerchant(merchantStatus);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/welcome");
  };

  const handleBasket = () => {
    navigate("/basket");
  };

  const handleOrder = () => {
    navigate("/orders");
  };

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo always visible but position changes based on login status */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              flexGrow: token ? 0 : 1, // If logged in, do not grow, otherwise center
              justifyContent: "flex-start", // Left align if logged in
            }}
          >
            E-Commerce Store
          </Typography>

          {token && (
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
              {!isMerchant && (
                <Tooltip title="Basket">
                  <IconButton color="inherit" onClick={handleBasket}>
                    <ShoppingBasketIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Orders">
                <IconButton color="inherit" onClick={handleOrder}>
                  <ListAltIcon />
                </IconButton>
              </Tooltip>
              {isMerchant && (
                <Tooltip title="Add Product">
                  <IconButton color="inherit" onClick={handleAddProduct}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Logout">
                <IconButton color="inherit" onClick={handleLogout}>
                  <ExitToAppIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavigationBar;
