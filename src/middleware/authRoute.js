import React from "react";
import AuthContext from "../auth_context/authContext";
import { Navigate, useLocation } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const context = React.useContext(AuthContext);
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!token && !context.token) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthRoute;
