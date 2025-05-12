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
