import { RuntimeMessage } from '../../../types/messages';

export interface PostMessagePayload extends Record<string, any> {
  action: string;
}

export const postMessage = <T extends PostMessagePayload>(payload: T) => {
  const message = {
    source: 'response-interceptor',
    from: 'injected-script',
    payload,
  };
  window.postMessage(message, '*');
};

export const listenContentScriptMessages = (
  action: RuntimeMessage,
  callback: (message: unknown) => void
) => {
  window.addEventListener('message', (event) => {
    if (
      event.source !== window ||
      !event.data ||
      event.data.source !== 'devtools-response-overrider' ||
      event.data.from !== 'content-script'
    )
      return;

    const message = event.data.payload;
    if (message.action === action) {
      console.log('Received update', message);
      callback(message);
    }
  });
};
