import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';

test('renders HomePage component', () => {
  const { getByText } = render(
    <Router>
      <HomePage />
    </Router>
  );

  expect(getByText('Welcome to the Benefits Eligibility Service')).toBeInTheDocument();
  expect(getByText('Take a Quiz')).toBeInTheDocument();
  expect(getByText('Admin Login')).toBeInTheDocument();
});