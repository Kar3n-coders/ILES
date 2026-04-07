import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoutes({ allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Verifying Session ....</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is not the right role and is not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorised" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
