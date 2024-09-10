import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ManageBenefits from './ManageBenefits';

jest.mock('axios');

test('renders ManageBenefits component', () => {
  const { getByLabelText, getByText } = render(<ManageBenefits />);

  expect(getByText('Manage Benefits')).toBeInTheDocument();
  expect(getByLabelText('Benefit Name')).toBeInTheDocument();
  expect(getByLabelText('Federal')).toBeInTheDocument();
  expect(getByLabelText('Benefit URL')).toBeInTheDocument();
  expect(getByLabelText('Benefit Requirements (JSON format)')).toBeInTheDocument();
  expect(getByText('Add Benefit')).toBeInTheDocument();
});

test('handles adding a benefit', async () => {
  axios.post.mockResolvedValue({ data: { id: 1, benefitName: 'Test Benefit', federal: true, benefitUrl: 'http://example.com', benefitRequirements: {} } });
  axios.get.mockResolvedValue({ data: [] });

  const { getByLabelText, getByText } = render(<ManageBenefits />);

  fireEvent.change(getByLabelText('Benefit Name'), { target: { value: 'Test Benefit' } });
  fireEvent.click(getByLabelText('Federal'));
  fireEvent.change(getByLabelText('Benefit URL'), { target: { value: 'http://example.com' } });
  fireEvent.change(getByLabelText('Benefit Requirements (JSON format)'), { target: { value: '{}' } });
  fireEvent.click(getByText('Add Benefit'));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith('/api/benefits', {
      benefitName: 'Test Benefit',
      federal: true,
      state: null,
      benefitUrl: 'http://example.com',
      benefitRequirements: {},
    });
  });
});