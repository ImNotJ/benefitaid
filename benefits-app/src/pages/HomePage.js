import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Benefits App</h1>
      <Link to="/user-form">Fill out the form</Link>
      <br />
      <Link to="/admin-login">Admin Login</Link>
    </div>
  );
};

export default HomePage;