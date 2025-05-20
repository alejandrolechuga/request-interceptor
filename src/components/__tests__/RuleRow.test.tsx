import React from 'react';
import { render, screen } from '@testing-library/react';
import RuleRow from '../RuleRow';
import type { Rule } from '../RuleTable';

const rule: Rule = {
  id: '1',
  urlPattern: 'https://api.example.com/*',
  method: 'GET',
  enabled: true,
  date: '2024-01-01',
};

describe('<RuleRow />', () => {
  it('renders a table row with rule information', () => {
    render(
      <table>
        <tbody>
          <RuleRow rule={rule} />
        </tbody>
      </table>
    );

    const row = screen.getByRole('row');
    expect(row).toHaveTextContent(rule.urlPattern);
    expect(row).toHaveTextContent(rule.method);
    expect(row).toHaveTextContent('Yes');
    expect(row).toHaveTextContent(rule.date);
  });
});
