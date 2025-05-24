import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional: roles that are allowed to access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner or a blank page while auth state is being determined
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // User not authenticated, redirect to login page
    // Pass the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.utype)) {
    // User is authenticated but does not have the required role
    // Redirect to a 'Forbidden' page or back to the home page
    // For now, redirecting to home, but a dedicated "Forbidden" page would be better.
    console.warn(`User with role ${user.utype} tried to access a route restricted to ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />; 
  }

  // User is authenticated and (if roles are specified) has the required role
  return <>{children}</>;
};

export default ProtectedRoute;
