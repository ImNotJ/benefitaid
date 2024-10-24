import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
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
import { logout } from './services/auth'; // Adjust the path if necessary

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token'); // Get the token from localStorage

  useEffect(() => {
    let timerRef = null;

    if (token) {
      const decoded = jwtDecode(token); // Use jwtDecode instead of jwt_decode
      const expiryTime = (new Date(decoded.exp * 1000)).getTime();
      const currentTime = (new Date()).getTime();
      const timeout = expiryTime - currentTime;

      const onExpire = () => {
        const role = localStorage.getItem('role');
        if (role === 'ROLE_ADMIN' || role === 'ROLE_ROOT_ADMIN') {
          navigate('/admin-login'); // Redirect to admin login page
        } else {
          navigate('/user-login'); // Redirect to user login page
        }
        logout(); // Call the logout function from auth.js
      };

      if (timeout > 0) {
        // Token not expired, set future timeout to log out and redirect
        timerRef = setTimeout(onExpire, timeout);
      } else {
        // Token expired, log out and redirect
        onExpire();
      }
    }

    // Clear any running timers on component unmount or token state change
    return () => {
      clearTimeout(timerRef);
    };
  }, [dispatch, navigate, token]);

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