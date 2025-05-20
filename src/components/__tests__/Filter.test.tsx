import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filter from '../Filter';

describe('<Filter />', () => {
  it('calls onFilterChange when typing in input', () => {
    const handleChange = jest.fn();
    render(<Filter value="" onFilterChange={handleChange} />);

    const input = screen.getByPlaceholderText('Type out to filter list');
    fireEvent.change(input, { target: { value: 'api' } });
    expect(handleChange).toHaveBeenCalledWith('api');
  });

  it('calls onFilterChange with empty string when clear button clicked', () => {
    const handleChange = jest.fn();
    render(<Filter value="some" onFilterChange={handleChange} />);

    const button = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
