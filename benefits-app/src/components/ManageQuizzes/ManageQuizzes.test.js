import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ManageQuizzes from './ManageQuizzes';

jest.mock('axios');

test('renders ManageQuizzes component', () => {
  const { getByLabelText, getByText } = render(<ManageQuizzes />);

  expect(getByText('Manage Quizzes')).toBeInTheDocument();
  expect(getByLabelText('Quiz Name')).toBeInTheDocument();
  expect(getByLabelText('Questions')).toBeInTheDocument();
  expect(getByLabelText('Benefit')).toBeInTheDocument();
  expect(getByText('Add Quiz')).toBeInTheDocument();
});

test('handles adding a quiz', async () => {
  axios.post.mockResolvedValue({ data: { id: 1, quizName: 'Test Quiz', questions: [], benefit: '1' } });
  axios.get.mockResolvedValue({ data: [] });

  const { getByLabelText, getByText } = render(<ManageQuizzes />);

  fireEvent.change(getByLabelText('Quiz Name'), { target: { value: 'Test Quiz' } });
  fireEvent.change(getByLabelText('Questions'), { target: { value: ['1'] } });
  fireEvent.change(getByLabelText('Benefit'), { target: { value: '1' } });
  fireEvent.click(getByText('Add Quiz'));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith('/api/quizzes', {
      quizName: 'Test Quiz',
      questions: ['1'],
      benefit: '1',
    });
  });
});