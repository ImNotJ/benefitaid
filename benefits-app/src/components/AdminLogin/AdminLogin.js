import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import axios from '../../utils/axiosConfig'; // Import the configured Axios instance

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admins/login', { username, password });
      console.log('Login response:', response); // Debug log
      // Assuming the response contains a token and role
      document.cookie = `token=${response.data.token}; HttpOnly; Secure; SameSite=Strict`;
      console.log('Cookies after login:', document.cookie); // Debug log
      localStorage.setItem('role', response.data.role);
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;