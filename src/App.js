import "./App.css";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import UpdateProductPage from "./pages/UpdateProductPage";
import AuthContext from "./auth_context/authContext";
import AuthRoute from "./middleware/authRoute";
import WelcomePage from "./pages/WelcomePage";
import BasketPage from "./pages/BasketPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const [authState, setAuthState] = useState({
    token: null,
    userId: null,
    merchant: false,
  });

  const login = (token, userId, merchant) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("merchant", merchant);
    setAuthState({ token, userId, merchant });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("merchant");
    setAuthState({ token: null, userId: null, merchant: false });
  };

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        userId: authState.userId,
        login,
        logout,
        merchant: authState.merchant,
      }}
    >
      <div className="App">
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route
            path="/"
            element={
              <AuthRoute>
                <ProductsPage />
              </AuthRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <AuthRoute>
                <AddProductPage />
              </AuthRoute>
            }
          />
          <Route
            path="/update-product/:id"
            element={
              <AuthRoute>
                <UpdateProductPage />
              </AuthRoute>
            }
          />
          <Route
            path="/basket"
            element={
              <AuthRoute>
                <BasketPage />
              </AuthRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <AuthRoute>
                <OrdersPage />
              </AuthRoute>
            }
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
