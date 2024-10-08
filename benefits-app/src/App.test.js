import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

test('renders App component', () => {
  const { getByText } = render(
    <Router>
      <App />
    </Router>
  );

  expect(getByText('Welcome to the Benefits Eligibility Service')).toBeInTheDocument();
});