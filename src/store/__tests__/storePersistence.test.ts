import { setEnableRuleset } from '../settingsSlice';
import { addRule } from '../../Panel/ruleset/rulesetSlice';

describe('store persistence', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  function createChromeMocks(initial: any) {
    const setMock = jest.fn();
    (globalThis as any).chrome = {
      storage: {
        local: {
          get: jest.fn((_keys: string[], cb: (items: any) => void) =>
            cb(initial)
          ),
          set: setMock,
        },
      },
      tabs: {
        sendMessage: jest.fn(),
      },
      devtools: {
        inspectedWindow: { tabId: 1 },
      },
    };
    return { setMock };
  }

  it('loads persisted data on init', async () => {
    const stored = {
      settings: { enableRuleset: true },
      ruleset: [
        {
          id: '1',
          urlPattern: '/api',
          method: 'GET',
          enabled: true,
          date: '',
          response: null,
        },
      ],
    };
    createChromeMocks(stored);
    const { store } = await import('../index');
    expect(store.getState().settings.enableRuleset).toBe(true);
    expect(store.getState().ruleset).toEqual(stored.ruleset);
  });

  it('persists updates to chrome.storage.local', async () => {
    const stored = { settings: { enableRuleset: false }, ruleset: [] };
    const { setMock } = createChromeMocks(stored);
    const { store } = await import('../index');

    store.dispatch(setEnableRuleset(true));
    expect(setMock).toHaveBeenLastCalledWith({
      settings: { enableRuleset: true },
      ruleset: [],
    });

    store.dispatch(
      addRule({
        urlPattern: '/test',
        method: 'GET',
        enabled: true,
        date: '',
        response: null,
        statusCode: 200,
      })
    );
    expect(setMock).toHaveBeenLastCalledWith({
      settings: { enableRuleset: true },
      ruleset: expect.any(Array),
    });
    const lastCall = setMock.mock.calls[setMock.mock.calls.length - 1][0];
    expect(lastCall.ruleset).toHaveLength(1);
  });
});
