import api from './api';

/**
 * Logs in the user by sending a POST request to the login endpoint.
 * Stores the JWT token and user role in localStorage.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Object} The response data containing the token and role.
 */
export const login = async (username, password) => {
  const response = await api.post('/api/admins/login', { username, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('role', response.data.role); // Store the role as well
  return response.data;
};

/**
 * Logs out the user by removing the JWT token and user role from localStorage.
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); // Remove the role as well
};

/**
 * Checks if the user is authenticated by verifying the presence of a JWT token in localStorage.
 *
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};