import React from "react";
import { Navigate } from "react-router-dom";
import { parseJwt } from "../../config/jwtUtils";

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("jwt");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/admin/login" replace />;


  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateAdminRoute;
