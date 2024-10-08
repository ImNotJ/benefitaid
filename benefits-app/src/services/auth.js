import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/api/admins/login', { username, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('role', response.data.role); // Store the role as well
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); // Remove the role as well
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};