import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../pages/Panel/App'; // Adjust the path if necessary

describe('<App />', () => {
  it('renders the app container', () => {
    render(<App />);
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toBeInTheDocument();
  });
});