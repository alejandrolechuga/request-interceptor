import {
  ExtensionMessageType,
  ExtensionMessageOrigin,
} from '../../../types/runtimeMessage';

declare const require: any;

describe('Devtools unload behavior', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('sends state update when window is closing', () => {
    const sendMessageMock = jest.fn();
    (globalThis as any).chrome = {
      tabs: { sendMessage: sendMessageMock },
      devtools: {
        inspectedWindow: { tabId: 1 },
        panels: { create: jest.fn() },
      },
      runtime: { onMessage: { addListener: jest.fn() } },
    };

    jest.isolateModules(() => {
      require('../index');
    });

    window.dispatchEvent(new Event('beforeunload'));

    expect(sendMessageMock).toHaveBeenCalledWith(1, {
      action: ExtensionMessageType.STATE_UPDATE,
      from: ExtensionMessageOrigin.DEVTOOLS,
      state: {
        settings: { patched: false },
        ruleset: [],
      },
    });
  });
});
