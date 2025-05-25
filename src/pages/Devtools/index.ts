import { emitExtensionState } from '../../../src/store';
import {
  ExtensionMessageType,
  ExtensionMessageOrigin,
} from '../../../src/types/runtimeMessage';

chrome.devtools.panels.create(
  'Override Response Tool',
  'icon-34.png',
  'panel.html'
);

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.source === ExtensionMessageOrigin.CONTENT_SCRIPT) {
    if (message.payload.action === ExtensionMessageType.RECEIVER_READY) {
      emitExtensionState();
    }
  }
});
