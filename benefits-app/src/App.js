import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ManageQuestions from './components/ManageQuestions/ManageQuestions';
import ManageBenefits from './components/ManageBenefits/ManageBenefits';
import ManageQuizzes from './components/ManageQuizzes/ManageQuizzes';
import UserForm from './components/UserForm/UserForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/manage-questions" component={ManageQuestions} />
        <Route path="/manage-benefits" component={ManageBenefits} />
        <Route path="/manage-quizzes" component={ManageQuizzes} />
        <Route path="/user-form" component={UserForm} />
      </Switch>
    </div>
  );
}

export default App;