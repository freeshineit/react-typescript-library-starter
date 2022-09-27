import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../Page';

test('renders learn react link', () => {
  render(<Page />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
