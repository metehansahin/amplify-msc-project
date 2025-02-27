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

const SignupPage = (props) => {
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
        `${process.env.REACT_APP_SERVER_URL}user/register`,
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
          Sign Up
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          {Object.keys(props)[0] !== "closeForm" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Button onClick={props.showSignup} variant="text">
                  Login
                </Button>
              </Typography>
            </Box>
          )}
        </form>
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

export default SignupPage;
