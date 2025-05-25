import { ExtensionReceivedState } from '../ExtensionReceivedState';

describe('ExtensionReceivedState', () => {
  it('provides default state when no initial state is given', () => {
    const state = new ExtensionReceivedState();
    expect(state.getState()).toEqual({
      settings: { enableRuleset: false },
      rules: [],
    });
  });

  it('allows updating and retrieving the state', () => {
    const state = new ExtensionReceivedState();
    state.updateState({ settings: { enableRuleset: true } });
    expect(state.getState().settings.enableRuleset).toBe(true);

    const ruleset = [
      {
        id: '1',
        urlPattern: '/api',
        method: 'GET',
        enabled: true,
        date: '',
        response: null,
      },
    ];
    state.updateState({ ruleset });
    expect(state.getState().ruleset).toEqual(ruleset);
  });

  it('merges updates with existing state', () => {
    const state = new ExtensionReceivedState({
      settings: { enableRuleset: false },
      ruleset: [],
    });
    state.updateState({ settings: { enableRuleset: true } });
    state.updateState({
      ruleset: [
        {
          id: '2',
          urlPattern: '/test',
          method: 'POST',
          enabled: false,
          date: '',
          response: null,
        },
      ],
    });
    expect(state.getState()).toEqual({
      settings: { enableRuleset: true },
      rules: [
        {
          id: '2',
          urlPattern: '/test',
          method: 'POST',
          enabled: false,
          date: '',
          response: null,
        },
      ],
    });
  });
});
