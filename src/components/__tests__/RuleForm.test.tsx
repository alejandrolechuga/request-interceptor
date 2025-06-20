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
    expect(
      (screen.getAllByLabelText(/method/i)[0] as HTMLSelectElement).value
    ).toBe('');
  });
  it('adds a rule when submitted in add mode', () => {
    const { store } = renderForm('add');

    fireEvent.change(screen.getByLabelText(/url pattern/i), {
      target: { value: 'https://example.com/*' },
    });
    fireEvent.change(screen.getAllByLabelText(/method/i)[0], {
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

  it('shows saved request body when editing a GET rule', async () => {
    const rule: Rule = {
      id: 'r1',
      urlPattern: '/foo',
      method: 'GET',
      enabled: true,
      statusCode: 200,
      date: '',
      response: '',
      requestBody: '{"x":1}',
      delayMs: null,
    } as Rule;
    renderForm('edit', [rule]);
    const textarea = (await screen.findByLabelText(
      /override request body/i
    )) as HTMLTextAreaElement;
    expect(textarea).toBeDisabled();
  });

  it('clears request body when method changed to GET', () => {
    renderForm('add');
    fireEvent.change(screen.getAllByLabelText(/method/i)[0], {
      target: { value: 'POST' },
    });
    fireEvent.change(screen.getByLabelText(/override request body/i), {
      target: { value: 'data' },
    });
    fireEvent.change(screen.getAllByLabelText(/method/i)[0], {
      target: { value: 'GET' },
    });
    expect(
      (screen.getByLabelText(/override request body/i) as HTMLTextAreaElement)
        .value
    ).toBe('');
    expect(screen.getByLabelText(/override request body/i)).toBeDisabled();
  });

  it('saves empty request body for GET method', () => {
    const rule: Rule = {
      id: 'r2',
      urlPattern: '/foo',
      method: 'POST',
      enabled: true,
      statusCode: 200,
      date: '',
      response: '',
      requestBody: 'data',
      delayMs: null,
    } as Rule;

    const { store } = renderForm('edit', [rule]);

    fireEvent.change(screen.getAllByLabelText(/method/i)[0], {
      target: { value: 'GET' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(store.getState().ruleset[0].requestBody).toBe('');
  });
});
