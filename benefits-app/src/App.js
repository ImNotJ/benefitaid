import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ManageQuestions from './components/ManageQuestions/ManageQuestions';
import ManageBenefits from './components/ManageBenefits/ManageBenefits';
import ManageQuizzes from './components/ManageQuizzes/ManageQuizzes';
import UserForm from './components/UserForm/UserForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/manage-questions" element={<ManageQuestions />} />
      <Route path="/manage-benefits" element={<ManageBenefits />} />
      <Route path="/manage-quizzes" element={<ManageQuizzes />} />
      <Route path="/user-form" element={<UserForm />} />
    </Routes>
  );
}

export default App;