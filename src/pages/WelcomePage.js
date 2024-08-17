import React, { useState } from "react";
import { Grid } from "@mui/material";
import LoginPage from "./LoginPage";
import SignupPage from "./SignUpPage";
import NavigationBar from "../components/NavigationBar";

const WelcomePage = () => {
  const [login, setLogin] = useState(true);

  const handleWelcome = () => {
    setLogin(!login);
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <Grid
        container
        direction="column"
        alignContent="center"
        justifyContent="center"
        gap={5}
        style={{ paddingTop: "50px" }}
      >
        <Grid item>
          {login ? (
            <LoginPage showSignup={handleWelcome} />
          ) : (
            <SignupPage showSignup={handleWelcome} />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default WelcomePage;
