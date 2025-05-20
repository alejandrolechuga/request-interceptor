// src/components/__tests__/RuleTable.test.tsx
import React from 'react';

import { render, screen } from '@testing-library/react';

import RuleTable, { Rule } from '../RuleTable';
import mockRules from '../../mocks/rules.json';

describe('<RuleTable />', () => {
  const renderRuleTable = (rules: Rule[] = []) => {
    render(<RuleTable rules={rules} />);
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('renders the component without crashing with an empty array', () => {
    renderRuleTable();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders the correct table headers', () => {
    renderRuleTable();
    expect(screen.getByText('URL Pattern')).toBeInTheDocument();
    expect(screen.getByText('Method')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders rows with request data passed in the props', () => {
    // Mock requests data
    renderRuleTable(mockRules);

    // Use screen.getAllByRole to get all table rows
    const rows = screen.getAllByRole('row');

    // Assert that the number of rows is correct (header + data rows)
    expect(rows).toHaveLength(mockRules.length + 1);

    // Iterate through the mock requests and assert that the data is rendered correctly
    mockRules.forEach((rule, index) => {
      // rows[index + 1] because the first row is the header
      const row = rows[index + 1];
      expect(row).toHaveTextContent(rule.urlPattern);
      expect(row).toHaveTextContent(rule.method);
      expect(row).toHaveTextContent(rule.enabled ? 'Yes' : 'No');
      expect(row).toHaveTextContent(rule.date);

      const editButton = row.querySelector('button');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveTextContent('Edit');
    });
  });
});
