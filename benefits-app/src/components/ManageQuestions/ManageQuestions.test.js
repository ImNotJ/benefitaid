import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ManageQuestions from './ManageQuestions';

jest.mock('axios');

test('renders ManageQuestions component', () => {
  const { getByLabelText, getByText } = render(<ManageQuestions />);

  expect(getByText('Manage Questions')).toBeInTheDocument();
  expect(getByLabelText('Question Name')).toBeInTheDocument();
  expect(getByLabelText('Question Type')).toBeInTheDocument();
  expect(getByLabelText('Question Text')).toBeInTheDocument();
  expect(getByText('Add Question')).toBeInTheDocument();
});

test('handles adding a question', async () => {
  axios.post.mockResolvedValue({ data: { id: 1, questionName: 'Test Question', questionType: 'text', questionText: 'What is your name?' } });
  axios.get.mockResolvedValue({ data: [] });

  const { getByLabelText, getByText } = render(<ManageQuestions />);

  fireEvent.change(getByLabelText('Question Name'), { target: { value: 'Test Question' } });
  fireEvent.change(getByLabelText('Question Type'), { target: { value: 'text' } });
  fireEvent.change(getByLabelText('Question Text'), { target: { value: 'What is your name?' } });
  fireEvent.click(getByText('Add Question'));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith('/api/questions', {
      questionName: 'Test Question',
      questionType: 'text',
      questionText: 'What is your name?',
    });
  });
});