import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth_context/authContext";
import axios from "axios";

const LoginPage = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const context = React.useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.SERVER_URL}/user/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        if (Object.keys(props)[0] !== "closeForm") {
          context.login(
            response.data.token,
            response.data.userId,
            response.data.merchant
          );
          navigate("/");
        } else {
          context.login(
            response.data.token,
            response.data.userId,
            response.data.merchant
          );
          props.closeForm();
        }
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Welcome To The Best E-Commerce Store!</h1>
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={credentials.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={credentials.password}
            onChange={handleChange}
          />
        </form>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Login
        </Button>
        {Object.keys(props)[0] !== "closeForm" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Button onClick={props.showSignup} variant="text">
                Sign Up
              </Button>
            </Typography>
          </Box>
        )}
      </Box>
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
    </Container>
  );
};

export default LoginPage;
