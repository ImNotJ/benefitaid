import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import UserForm from './UserForm';

jest.mock('axios');

test('renders UserForm component', () => {
  const { getByLabelText, getByText } = render(<UserForm />);

  expect(getByText('User Form')).toBeInTheDocument();
  expect(getByLabelText('Email')).toBeInTheDocument();
  expect(getByText('Submit')).toBeInTheDocument();
});

test('handles form submission', async () => {
  axios.post.mockResolvedValue({ data: [{ id: 1, benefitName: 'Test Benefit', benefitUrl: 'http://example.com' }] });
  axios.get.mockResolvedValue({ data: [{ id: 1, questionText: 'What is your name?', questionType: 'text' }] });

  const { getByLabelText, getByText } = render(<UserForm />);

  fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(getByLabelText('What is your name?'), { target: { value: 'John Doe' } });
  fireEvent.click(getByText('Submit'));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith('/api/eligibility/check', {
      email: 'test@example.com',
      responses: { '1': 'John Doe' },
    });
  });

  expect(getByText('Eligibility Results')).toBeInTheDocument();
  expect(getByText('Test Benefit')).toBeInTheDocument();
});