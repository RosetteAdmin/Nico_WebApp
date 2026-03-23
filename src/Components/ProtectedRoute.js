import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — Role-based route guard
 * 
 * Usage:
 *   <ProtectedRoute allowedRoles={[0, 1]}>
 *     <MyComponent />
 *   </ProtectedRoute>
 * 
 * If the logged-in user's role is NOT in allowedRoles,
 * they are redirected to /dashboard.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  // Not logged in at all — redirect to login
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = Number(storedUser.role);

  // Role not in allowed list — redirect to dashboard
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;