import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

/**
 * AdminDashboard component for managing admin-related tasks.
 *
 * @returns {React.ReactNode} The rendered component.
 */
function AdminDashboard() {
  const navigate = useNavigate();

  /**
   * Handles the logout process by removing the token and role from localStorage
   * and navigating to the admin login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin-login');
  };

  return (
    <div className="admin-dashboard">
      <div className="top-buttons">
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
      <h2>Admin Dashboard</h2>
      <div className="links">
        <Link to="/manage-questions" className="btn btn-primary">Manage Questions</Link>
        <Link to="/manage-benefits" className="btn btn-primary">Manage Benefits</Link>
        <Link to="/manage-quizzes" className="btn btn-primary">Manage Quizzes</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;