import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleBackToHomepage = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin-login');
  };

  return (
    <div className="admin-dashboard">
      <div className="top-buttons">
        <button onClick={handleBackToHomepage} className="btn btn-secondary">
          Back to Homepage
        </button>
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