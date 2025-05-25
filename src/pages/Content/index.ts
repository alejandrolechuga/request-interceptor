import { ExtensionMessageOrigin } from '../../../src/types/runtimeMessage';

export const listenInjectedScript = () => {
  window.addEventListener('message', function (event) {
    // Filter out any messages not sent by our extension code
    if (event.source !== window || !event.data) return;

    // Process messages coming from the injected script
    if (event.data.from === ExtensionMessageOrigin.RECEIVER) {
      console.log('[FORWARD-FROM-RECEIVER-TO-DEVTOOLS]', event.data);
      this.chrome.runtime.sendMessage({
        source: ExtensionMessageOrigin.CONTENT_SCRIPT,
        payload: event.data,
      });
    }
  });
};

export function listenPanelMessages() {
  if (
    typeof chrome !== 'undefined' &&
    chrome.runtime &&
    chrome.runtime.onMessage
  ) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('[Content] Received message from panel:', message, sender);
      if (message.from === ExtensionMessageOrigin.DEVTOOLS) {
        window.postMessage(message, '*');
      }
    });
  } else {
    console.warn('[Content] chrome.runtime.onMessage is not available');
  }
}
listenInjectedScript();
listenPanelMessages();
