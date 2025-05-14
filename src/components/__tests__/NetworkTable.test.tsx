// src/components/__tests__/NetworkTable.test.tsx
import React from 'react';

import { render, screen } from '@testing-library/react';

// Ensure jest-dom is imported globally in your Jest setup file if not already done
import NetworkTable, { Request } from '../NetworkTable'; // Adjust the path if necessary
// Import the mock requests data
import mockRequests from '../../mocks/requests.json';

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

  it.skip('renders rows with request data passed in the props', () => {
    // Mock requests data
    renderNetworkTable(mockRequests);

    // Use screen.getAllByRole to get all table rows
    const rows = screen.getAllByRole('row');

    // Assert that the number of rows is correct (header + data rows)
    expect(rows).toHaveLength(mockRequests.length + 1);

    // Iterate through the mock requests and assert that the data is rendered correctly
    mockRequests.forEach((request, index) => {
      // rows[index + 1] because the first row is the header
      const row = rows[index + 1];

      // Use findByText within the row to target specific cells
      expect(row).toHaveTextContent(request.url);
      expect(row).toHaveTextContent(request.status.toString()); // Convert status to string
      expect(row).toHaveTextContent(request.response);
    });
  });
});
