// src/components/__tests__/NetworkTable.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

// Ensure jest-dom is imported globally in your Jest setup file if not already done
import NetworkTable, { Request } from '../NetworkTable'; // Adjust the path if necessary

describe('<NetworkTable />', () => {
  // Helper function to render the component with optional props
  const renderNetworkTable = (requests: Request[] = []) => {
    render(<NetworkTable requests={requests} />);
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders the component without crashing with an empty array', () => {
    renderNetworkTable();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders the correct table headers', () => {
    renderNetworkTable();
    expect(screen.getByText('URL')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Response')).toBeInTheDocument();
  });

  it.skip('renders rows for each request passed in the props', () => {
    const mockRequests: Request[] = [
      // Use 'any' to avoid defining a new interface
      {
        id: '1',
        url: 'https://example.com/api/users',
        status: 200,
        response: 'OK',
      },
      {
        id: '2',
        url: 'https://anothersite.org/data',
        status: 404,
        response: 'Not Found',
      },
      {
        id: '3',
        url: 'https://test.com/resource',
        status: 201,
        response: 'Created',
      },
    ];
    renderNetworkTable(mockRequests);

    // Check for the presence of the URLs, statuses, and responses
    expect(
      screen.getByText('https://example.com/api/users')
    ).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();

    expect(
      screen.getByText('https://anothersite.org/data')
    ).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();

    expect(screen.getByText('https://test.com/resource')).toBeInTheDocument();
    expect(screen.getByText('201')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();

    // Check the number of rows (including the header)
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockRequests.length + 1); // +1 for the header row
  });
});
