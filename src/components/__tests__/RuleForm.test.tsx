import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RuleForm from '../RuleForm';
import rulesetReducer from '../../Panel/ruleset/rulesetSlice';
import settingsReducer from '../../store/settingsSlice';
import matchesReducer from '../../store/matchSlice';
import { Rule } from '../../../src/types/rule';

const renderForm = (mode: 'add' | 'edit', preloadedRules: Rule[] = []) => {
  const store = configureStore({
    reducer: {
      settings: settingsReducer,
      ruleset: rulesetReducer,
      matches: matchesReducer,
    },
    preloadedState: {
      settings: { patched: false },
      ruleset: preloadedRules,
      matches: {},
    },
  });

  const onBack = jest.fn();

  render(
    <Provider store={store}>
      <RuleForm mode={mode} ruleId={preloadedRules[0]?.id} onBack={onBack} />
    </Provider>
  );

  return { store, onBack };
};

describe('<RuleForm />', () => {
  it('defaults method to empty value in add mode', () => {
    renderForm('add');
    expect((screen.getByLabelText(/method/i) as HTMLSelectElement).value).toBe(
      ''
    );
  });
  it('adds a rule when submitted in add mode', () => {
    const { store } = renderForm('add');

    fireEvent.change(screen.getByLabelText(/url pattern/i), {
      target: { value: 'https://example.com/*' },
    });
    fireEvent.change(screen.getByLabelText(/method/i), {
      target: { value: 'GET' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(store.getState().ruleset).toHaveLength(1);
  });

  it('calls onBack when back button clicked', () => {
    const { onBack } = renderForm('add');
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalled();
  });

  it('shows an error for invalid RegExp patterns', () => {
    const { store } = renderForm('add');

    fireEvent.change(screen.getByLabelText(/url pattern/i), {
      target: { value: '(' },
    });
    fireEvent.click(screen.getByLabelText(/treat as regexp/i));

    expect(screen.getByText(/invalid regexp pattern/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(store.getState().ruleset).toHaveLength(0);
  });

  it('saves a rule when a valid RegExp is provided', () => {
    const { store } = renderForm('add');

    fireEvent.change(screen.getByLabelText(/url pattern/i), {
      target: { value: '^/api' },
    });
    fireEvent.click(screen.getByLabelText(/treat as regexp/i));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    const added = store.getState().ruleset[0];
    expect(added.isRegExp).toBe(true);
    expect(added.urlPattern).toBe('^/api');
  });
});
