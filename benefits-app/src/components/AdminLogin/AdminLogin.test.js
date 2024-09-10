import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import AdminLogin from './AdminLogin';

jest.mock('axios');

test('renders AdminLogin component', () => {
  const { getByLabelText, getByText } = render(
    <Router>
      <AdminLogin />
    </Router>
  );

  expect(getByLabelText('Username')).toBeInTheDocument();
  expect(getByLabelText('Password')).toBeInTheDocument();
  expect(getByText('Login')).toBeInTheDocument();
});

test('handles login', async () => {
  axios.post.mockResolvedValue({ data: { token: 'fake-token' } });

  const { getByLabelText, getByText } = render(
    <Router>
      <AdminLogin />
    </Router>
  );

  fireEvent.change(getByLabelText('Username'), { target: { value: 'admin' } });
  fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
  fireEvent.click(getByText('Login'));

  await waitFor(() => {
    expect(localStorage.getItem('token')).toBe('fake-token');
  });
});