import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
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