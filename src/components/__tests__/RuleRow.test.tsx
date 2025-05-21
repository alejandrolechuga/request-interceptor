import React from 'react';
import { render, screen } from '@testing-library/react';
import RuleRow from '../RuleRow';
import type { Rule } from '../../types/rule';
import { COLUMN_ORDER } from '../columnConfig';

const rule: Rule = {
  id: '1',
  urlPattern: 'https://api.example.com/*',
  method: 'GET',
  enabled: true,
  date: '2024-01-01',
  response: null,
};

describe('<RuleRow />', () => {
  it('renders a table row with rule information', () => {
    render(
      <table>
        <tbody>
          <RuleRow rule={rule} columns={COLUMN_ORDER} />
        </tbody>
      </table>
    );

    const row = screen.getByRole('row');
    const cells = row.querySelectorAll('td');
    expect(cells).toHaveLength(COLUMN_ORDER.length);

    expect(row).toHaveTextContent(rule.urlPattern);
    expect(row).toHaveTextContent(rule.method);
    expect(row).toHaveTextContent('Yes');
    expect(row).toHaveTextContent(rule.date);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });
});
