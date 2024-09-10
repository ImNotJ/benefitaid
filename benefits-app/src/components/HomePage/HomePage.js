import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to the Benefits Eligibility Service</h1>
      <div className="links">
        <Link to="/user-form" className="btn btn-primary">Take a Quiz</Link>
        <Link to="/admin-login" className="btn btn-secondary">Admin Login</Link>
      </div>
    </div>
  );
}

export default HomePage;