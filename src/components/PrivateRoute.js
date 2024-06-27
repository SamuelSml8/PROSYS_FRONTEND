// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

const PrivateRoute = ({ children }) => {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/landing" />;
  }

  return children;
};

export default PrivateRoute;
