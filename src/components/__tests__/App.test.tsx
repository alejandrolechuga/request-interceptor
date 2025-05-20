import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../pages/Panel/App';
import mockData from '../../mocks/rules.json';

describe('<App />', () => {
  it('renders the app container', () => {
    render(<App />);
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toBeInTheDocument();
  });

  it('filters rules based on url', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('type out to filter list');
    fireEvent.change(input, { target: { value: 'static' } });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2); // header + 1 filtered row
    expect(
      screen.getByText('https://static.example.com/*')
    ).toBeInTheDocument();
  });

  it('clears the filter and shows all rules', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('type out to filter list');
    fireEvent.change(input, { target: { value: 'static' } });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockData.length + 1);
  });
});
