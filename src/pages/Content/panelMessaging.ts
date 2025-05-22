import { RuntimeMessage } from '../../types/messages';
export const listenPanelMessages = () => {
  chrome.runtime.onMessage.addListener((message) => {
    console.log('Received message from panel:', message);
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
