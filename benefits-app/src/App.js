import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ManageQuestions from './components/ManageQuestions/ManageQuestions';
import ManageBenefits from './components/ManageBenefits/ManageBenefits';
import ManageQuizzes from './components/ManageQuizzes/ManageQuizzes';
import UserForm from './components/UserForm/UserForm';
import UserDashboard from './components/UserDashboard/UserDashboard';
import CreateAccount from './components/CreateAccount/CreateAccount';
import PrivateRoute from './utils/PrivateRoute';
import UserLogin from './components/UserLogin/UserLogin'; // Import UserLogin component

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/user-login" element={<UserLogin />} /> {/* Add UserLogin route */}
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ROOT_ADMIN']}><AdminDashboard /></PrivateRoute>} />
      <Route path="/manage-questions" element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ROOT_ADMIN']}><ManageQuestions /></PrivateRoute>} />
      <Route path="/manage-benefits" element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ROOT_ADMIN']}><ManageBenefits /></PrivateRoute>} />
      <Route path="/manage-quizzes" element={<PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ROOT_ADMIN']}><ManageQuizzes /></PrivateRoute>} />
      <Route path="/user-form" element={<PrivateRoute allowedRoles={['ROLE_USER']}><UserForm /></PrivateRoute>} />
      <Route path="/user-dashboard" element={<PrivateRoute allowedRoles={['ROLE_USER']}><UserDashboard /></PrivateRoute>} />
    </Routes>
  );
}

export default App;