import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * A component to protect routes based on user authentication and roles.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if access is allowed.
 * @param {Array<string>} props.allowedRoles - The roles allowed to access the route.
 * @returns {React.ReactNode} The child components if access is allowed, otherwise a redirect component.
 */
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  // If no token is found, redirect to the user login page
  if (!token) {
    return <Navigate to="/user-login" state={{ from: location }} />;
  }

  // If the user's role is not allowed, redirect to the home page
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  // If access is allowed, render the child components
  return children;
};

export default PrivateRoute;