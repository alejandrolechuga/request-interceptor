// src/components/__tests__/RuleTable.test.tsx
import React from 'react';

import { render, screen } from '@testing-library/react';

import RuleTable from '../RuleTable';
import type { Rule } from '../../types/rule';
import { COLUMN_ORDER, COLUMN_LABELS } from '../columnConfig';
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
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(COLUMN_ORDER.length);
    COLUMN_ORDER.forEach((column) => {
      expect(screen.getByText(COLUMN_LABELS[column])).toBeInTheDocument();
    });
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
      const cells = row.querySelectorAll('td');
      expect(cells).toHaveLength(COLUMN_ORDER.length);

      expect(row).toHaveTextContent(rule.urlPattern);
      expect(row).toHaveTextContent(rule.method);
      expect(row).toHaveTextContent(rule.enabled ? 'Yes' : 'No');
      expect(row).toHaveTextContent(rule.date);

      const buttons = row.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('Edit');
      expect(buttons[1]).toHaveTextContent('Delete');
    });
  });

  it('header and row column counts match', () => {
    renderRuleTable(mockRules);
    const headerCells = screen.getAllByRole('columnheader');
    const dataRows = screen.getAllByRole('row').slice(1);

    dataRows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      expect(cells).toHaveLength(headerCells.length);
    });
  });
});
