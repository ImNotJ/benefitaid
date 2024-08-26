import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserFormPage from './pages/UserFormPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const Navigation = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/user-form" component={UserFormPage} />
        <Route path="/admin-login" component={AdminLoginPage} />
        <Route path="/admin-dashboard" component={AdminDashboardPage} />
      </Switch>
    </Router>
  );
};

export default Navigation;