import React from "react";

const AuthContext = React.createContext({
  token: null,
  userId: null,
  login: (token, userId, merchant) => {},
  logout: () => {},
  merchant: false,
});

export default AuthContext;
