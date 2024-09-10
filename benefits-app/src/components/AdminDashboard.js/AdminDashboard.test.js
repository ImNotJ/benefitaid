import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

test('renders AdminDashboard component', () => {
  const { getByText } = render(
    <Router>
      <AdminDashboard />
    </Router>
  );

  expect(getByText('Admin Dashboard')).toBeInTheDocument();
  expect(getByText('Manage Questions')).toBeInTheDocument();
  expect(getByText('Manage Benefits')).toBeInTheDocument();
  expect(getByText('Manage Quizzes')).toBeInTheDocument();
});