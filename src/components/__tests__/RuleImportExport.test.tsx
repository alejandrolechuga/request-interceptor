import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RuleImportExport from '../RuleImportExport';
import rulesetReducer from '../../Panel/ruleset/rulesetSlice';
import settingsReducer from '../../store/settingsSlice';
import matchesReducer from '../../store/matchSlice';
import type { Rule } from '../../types/rule';

const createStore = (rules: Rule[] = []) =>
  configureStore({
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

describe('<RuleImportExport />', () => {
  it('exports rules using URL.createObjectURL', () => {
    const rules: Rule[] = [
      {
        id: '1',
        urlPattern: '/api',
        isRegExp: false,
        method: 'GET',
        enabled: true,
        statusCode: 200,
        date: '2024-01-01',
        response: null,
      },
    ];
    const store = createStore(rules);
    const createObjectURL = jest.fn().mockReturnValue('blob:url');
    (URL as any).createObjectURL = createObjectURL;
    (URL as any).revokeObjectURL = jest.fn();
    render(
      <Provider store={store}>
        <RuleImportExport rules={rules} />
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Export Rules' }));
    expect(createObjectURL).toHaveBeenCalled();
  });

  it('imports rules from a JSON file', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <RuleImportExport rules={[]} />
      </Provider>
    );
    const file = new File(
      [
        JSON.stringify([
          {
            urlPattern: '/api',
            method: 'GET',
            enabled: true,
            statusCode: 200,
          },
        ]),
      ],
      'rules.json',
      { type: 'application/json' }
    );
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const reader: any = {
      onload: null,
      result: '',
      readAsText() {
        reader.result = JSON.stringify([
          { urlPattern: '/api', method: 'GET', enabled: true, statusCode: 200 },
        ]);
        if (reader.onload) {
          reader.onload({} as ProgressEvent<FileReader>);
        }
      },
    };
    jest.spyOn(window as any, 'FileReader').mockImplementation(() => reader);
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(store.getState().ruleset).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Rules imported successfully'
    );
  });

  it('confirms before overwriting existing rules', () => {
    const initial: Rule[] = [
      {
        id: '1',
        urlPattern: '/api',
        isRegExp: false,
        method: 'GET',
        enabled: true,
        statusCode: 200,
        date: '2024-01-01',
        response: null,
      },
    ];
    const store = createStore(initial);
    render(
      <Provider store={store}>
        <RuleImportExport rules={initial} />
      </Provider>
    );
    const file = new File(
      [
        JSON.stringify([
          {
            urlPattern: '/other',
            method: 'POST',
            enabled: true,
            statusCode: 201,
          },
        ]),
      ],
      'rules.json',
      { type: 'application/json' }
    );
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const reader: any = {
      onload: null,
      result: '',
      readAsText() {
        reader.result = JSON.stringify([
          {
            urlPattern: '/other',
            method: 'POST',
            enabled: true,
            statusCode: 201,
          },
        ]);
        if (reader.onload) {
          reader.onload({} as ProgressEvent<FileReader>);
        }
      },
    };
    jest.spyOn(window as any, 'FileReader').mockImplementation(() => reader);
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(
      screen.getByText('Overwrite existing rules with imported ones?')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(store.getState().ruleset).toHaveLength(2);
    expect(store.getState().ruleset[1].urlPattern).toBe('/other');
  });
});
