import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */

import React from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Display a loader during authentication verification
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Redirect to login page if user is not logged in
  if (!isAuthenticated) {
    // Save the current URL to return to it after logging in
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If the user is authenticated, display child routes
  return <Outlet />;
};

export default ProtectedRoute;
