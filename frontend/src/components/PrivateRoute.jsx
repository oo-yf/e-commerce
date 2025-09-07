import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in, redirect to login
  return user ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;