import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';
import axios from '../../utils/axiosConfig';

/**
 * UserLogin component for handling user login.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function UserLogin() {
  const [email, setEmail] = useState('');
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
      let response = await axios.post('/api/users/login', { email, password });
      console.log('User login response:', response);
      handleSuccessfulLogin(response.data, '/user-dashboard');
    } catch (userErr) {
      console.log('User login failed:', userErr);
      setError('Invalid email or password');
      setSuccess('');
    }
  };

  /**
   * Handles successful login.
   *
   * @param {Object} data - The response data from the login API.
   * @param {string} redirectPath - The path to redirect to after successful login.
   */
  const handleSuccessfulLogin = (data, redirectPath) => {
    console.log('Successful login data:', data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('email', email); // Store email in localStorage
    localStorage.setItem('password', password); // Store password in localStorage
    setSuccess('Login successful! Redirecting...');
    setError('');
    setTimeout(() => {
      console.log(`Redirecting to ${redirectPath}`);
      navigate(redirectPath);
    }, 2000); // Redirect after 2 seconds
  };

  /**
   * Clears the current session.
   */
  const clearCurrentSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email'); // Clear email from localStorage
    localStorage.removeItem('password'); // Clear password from localStorage
  };

  /**
   * Handles navigation back to the homepage.
   */
  const handleBackToHomepage = () => {
    navigate('/');
  };

  return (
    <div className="user-login">
      <div className="top-buttons">
        <button onClick={handleBackToHomepage} className="btn btn-secondary">
          Back to Homepage
        </button>
      </div>
      <h2>Login</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default UserLogin;