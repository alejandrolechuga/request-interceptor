import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import RuleRow from '../RuleRow';
import type { Rule } from '../../types/rule';
import { COLUMN_ORDER } from '../columnConfig';
import rulesetReducer from '../../Panel/ruleset/rulesetSlice';
import settingsReducer from '../../store/settingsSlice';
import matchesReducer from '../../store/matchSlice';

const rule: Rule = {
  id: '1',
  urlPattern: 'https://api.example.com/*',
  isRegExp: false,
  method: 'GET',
  enabled: true,
  statusCode: 200,
  date: '2024-01-01',
  response: null,
  delayMs: null,
};

describe('<RuleRow />', () => {
  const renderRow = (rules: Rule[] = [rule], onEdit = jest.fn()) => {
    const store = configureStore({
      reducer: {
        settings: settingsReducer,
        ruleset: rulesetReducer,
        matches: matchesReducer,
      },
      preloadedState: {
        settings: { patched: false },
        ruleset: rules,
        matches: {},
      },
    });
    render(
      <Provider store={store}>
        <table>
          <tbody>
            <RuleRow rule={rules[0]} columns={COLUMN_ORDER} onEdit={onEdit} />
          </tbody>
        </table>
      </Provider>
    );
    return store;
  };

  it('renders a table row with rule information', () => {
    renderRow();

    const row = screen.getByRole('row');
    const cells = row.querySelectorAll('td');
    expect(cells).toHaveLength(COLUMN_ORDER.length);

    expect(row).toHaveTextContent(rule.urlPattern);
    expect(row).toHaveTextContent(rule.method);
    expect(screen.getByRole('button', { name: 'Enabled' })).toBeInTheDocument();

    const editButton = screen.getByRole('button', { name: 'Edit' });
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('dispatches removeRule when delete button clicked', () => {
    const store = renderRow();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    expect(store.getState().ruleset).toHaveLength(0);
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    renderRow([rule], onEdit);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(rule.id);
  });

  it('shows "Match All" when no method is set', () => {
    const noMethod = { ...rule, method: '' };
    renderRow([noMethod]);
    const row = screen.getByRole('row');
    expect(row).toHaveTextContent('Match All');
  });
});
