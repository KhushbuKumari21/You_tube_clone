// src/components/ProtectedRoute.jsx

// React & Redux imports
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/*
  ProtectedRoute:
  - This component protects specific routes from unauthenticated users.
  - If the user is NOT logged in, it redirects them to the login page.
  - If logged in, it allows access to the desired child component.
*/
const ProtectedRoute = ({ children }) => {
  // Get logged-in user from Redux store
  const { currentUser } = useSelector((state) => state.user);

  // If user is not logged in → redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user exists → allow access to protected page
  return children;
};

export default ProtectedRoute;
