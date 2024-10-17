import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

/**
 * UserDashboard component for displaying the user dashboard.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function UserDashboard() {
  const navigate = useNavigate();

  /**
   * Handles the logout process.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/user-login'); // Redirect to user login page
  };

  return (
    <div className="user-dashboard">
      <div className="top-buttons">
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
      <h2>User Dashboard</h2>
      <div className="links">
        <Link to="/user-form" className="btn btn-primary">Benefit Eligibility Aid</Link>
      </div>
    </div>
  );
}

export default UserDashboard;