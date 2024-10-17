import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import axios from '../../utils/axiosConfig';

/**
 * AdminLogin component for handling admin login.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  /**
   * Handles the login process.
   *
   * @param {Event} e - The form submit event.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      clearCurrentSession(); // Clear current session before login
      // Try admin login first
      let response = await axios.post('/api/admins/login', { username: identifier, password });
      console.log('Admin login response:', response);
      handleSuccessfulLogin(response.data, '/admin-dashboard');
    } catch (adminErr) {
      console.log('Admin login failed:', adminErr);
      setError('Invalid username or password');
      setSuccess('');
    }
  };

  /**
   * Handles successful login by storing the token and role in localStorage
   * and navigating to the specified path.
   *
   * @param {Object} data - The login response data.
   * @param {string} redirectPath - The path to redirect to after successful login.
   */
  const handleSuccessfulLogin = (data, redirectPath) => {
    console.log('Successful login data:', data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    setSuccess('Login successful! Redirecting...');
    setError('');
    setTimeout(() => {
      console.log(`Redirecting to ${redirectPath}`);
      navigate(redirectPath);
    }, 2000); // Redirect after 2 seconds
  };

  /**
   * Clears the current session by removing the token and role from localStorage.
   */
  const clearCurrentSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  /**
   * Handles navigation back to the homepage.
   */
  const handleBackToHomepage = () => {
    navigate('/');
  };

  return (
    <div className="admin-login">
      <div className="top-buttons">
        <button onClick={handleBackToHomepage} className="btn btn-secondary">
          Back to Homepage
        </button>
      </div>
      <h2>Admin Login</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="identifier">Username</label>
          <input
            type="text"
            id="identifier"
            className="form-control"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;