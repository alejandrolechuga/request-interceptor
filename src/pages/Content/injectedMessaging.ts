import { RuntimeMessage } from '../../types/messages';

export const listenInjectedScript = () => {
  window.addEventListener('message', function (event) {
    // Filter out any messages not sent by our extension code
    if (
      event.source !== window ||
      !event.data ||
      event.data.source !== 'response-interceptor'
    )
      return;

    // Process messages coming from the injected script
    if (event.data.from === 'injected-script') {
      console.log(
        '[content script] Received message from injected script:',
        event.data.payload
      );

      // Reply back to the injected script
      window.postMessage(
        {
          source: 'devtools-response-overrider',
          from: 'content-script',
          type: 'response',
          payload: 'Hello back from content script',
        },
        '*'
      );
    }
  });
};

export const listenPanelMessages = () => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === RuntimeMessage.SETTINGS_UPDATE) {
      window.postMessage(
        {
          source: 'devtools-response-overrider',
          from: 'content-script',
          payload: message,
        },
        '*'
      );
    }
  });
};
