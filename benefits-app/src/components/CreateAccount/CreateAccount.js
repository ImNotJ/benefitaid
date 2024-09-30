import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css';
import axios from '../../utils/axiosConfig';

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', { email, password });
      setSuccess('Account created successfully! You can now log in.');
      setError('');
      setTimeout(() => navigate('/user-login'), 3000); // Redirect to user login page after 3 seconds
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('This email is already registered. Please use a different email.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      setSuccess('');
    }
  };

  const handleBackToHomepage = () => {
    navigate('/');
  };

  return (
    <div className="create-account">
      <div className="top-buttons">
        <button onClick={handleBackToHomepage} className="btn btn-secondary">
          Back to Homepage
        </button>
      </div>
      <h2>Create Account</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleCreateAccount}>
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
        <button type="submit" className="btn btn-primary">Create Account</button>
      </form>
    </div>
  );
}

export default CreateAccount;