import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  const currentPath = window.location.pathname;
  if (user) {
    if (user.role === 'admin' && !currentPath.startsWith('/admin')) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === 'student' && !currentPath.startsWith('/student')) {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

