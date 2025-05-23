import { InterceptState } from '../InterceptState';

describe('InterceptState', () => {
  it('provides default state when no initial state is given', () => {
    const state = new InterceptState();
    expect(state.getState()).toEqual({
      settings: { enableRuleset: false },
      rules: [],
    });
  });

  it('allows updating and retrieving the state', () => {
    const state = new InterceptState();
    state.updateState({ settings: { enableRuleset: true } });
    expect(state.getState().settings.enableRuleset).toBe(true);

    const rules = [
      {
        id: '1',
        urlPattern: '/api',
        method: 'GET',
        enabled: true,
        date: '',
        response: null,
      },
    ];
    state.updateState({ rules });
    expect(state.getState().rules).toEqual(rules);
  });

  it('merges updates with existing state', () => {
    const state = new InterceptState({
      settings: { enableRuleset: false },
      rules: [],
    });
    state.updateState({ settings: { enableRuleset: true } });
    state.updateState({ rules: [{
      id: '2',
      urlPattern: '/test',
      method: 'POST',
      enabled: false,
      date: '',
      response: null,
    }] });
    expect(state.getState()).toEqual({
      settings: { enableRuleset: true },
      rules: [{
        id: '2',
        urlPattern: '/test',
        method: 'POST',
        enabled: false,
        date: '',
        response: null,
      }],
    });
  });
});
