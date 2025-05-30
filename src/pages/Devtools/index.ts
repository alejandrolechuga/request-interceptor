import { emitExtensionState } from '../../../src/store';
import {
  ExtensionMessageType,
  ExtensionMessageOrigin,
} from '../../../src/types/runtimeMessage';
import {
  safeDevtoolsInspectedWindow,
  safeSendMessage,
} from '../../../src/chrome';

chrome.devtools.panels.create('HTTPMocky', 'icon-34.png', 'panel.html');

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.source === ExtensionMessageOrigin.CONTENT_SCRIPT) {
    if (message.payload.action === ExtensionMessageType.RECEIVER_READY) {
      emitExtensionState();
    }
  }
});

window.addEventListener('beforeunload', () => {
  const inspectedWindow = safeDevtoolsInspectedWindow();
  if (chrome.tabs && inspectedWindow) {
    safeSendMessage(inspectedWindow.tabId, {
      action: ExtensionMessageType.STATE_UPDATE,
      from: ExtensionMessageOrigin.DEVTOOLS,
      state: {
        settings: { patched: false },
        ruleset: [],
      },
    });
  }
});
