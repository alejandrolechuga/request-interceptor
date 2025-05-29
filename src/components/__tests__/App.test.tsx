import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../pages/Panel/App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rulesetReducer from '../../Panel/ruleset/rulesetSlice';
import settingsReducer from '../../store/settingsSlice';
import type { Rule } from '../../types/rule';
import mockData from '../../__mocks__/rules.json';

const createStore = (rules: Rule[] = mockData) =>
  configureStore({
    reducer: { settings: settingsReducer, ruleset: rulesetReducer },
    preloadedState: { settings: { patched: false }, ruleset: rules },
  });

describe('<App />', () => {
  it('renders the app container', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const appContainer = screen.getByTestId('app-container');
    expect(appContainer).toBeInTheDocument();
  });

  it('filters rules based on url', () => {
    jest.useFakeTimers();
    const store = createStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const input = screen.getByPlaceholderText('Type out to filter list');
    fireEvent.change(input, { target: { value: 'static' } });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2); // header + 1 filtered row
    expect(
      screen.getByText('https://static.example.com/*')
    ).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('clears the filter and shows all rules', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const input = screen.getByPlaceholderText('Type out to filter list');
    fireEvent.change(input, { target: { value: 'static' } });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockData.length + 1);
  });

  it('toggles interception button', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const button = screen.getByRole('button', { name: 'Enable Interception' });
    fireEvent.click(button);
    expect(
      screen.getByRole('button', { name: 'Interception Enabled' })
    ).toBeInTheDocument();
  });
});
