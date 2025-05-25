import { ExtensionReceivedState } from './ExtensionReceivedState';

const originalFetch = window.fetch;
const mapFetchArguments = (...args: [RequestInfo | URL, RequestInit?]) => {
  const requestInput: RequestInfo | URL = args[0];
  const requestInit: RequestInit | undefined = args[1];

  let requestUrl: string;
  let requestMethod: string;
  let requestHeaders: Record<string, string> = {};

  if (requestInput instanceof Request) {
    requestUrl = requestInput.url;
    requestMethod = requestInput.method;
    requestHeaders = Object.fromEntries(requestInput.headers.entries());
  } else {
    requestUrl = requestInput.toString();
    requestMethod = requestInit?.method || 'GET';
    if (requestInit?.headers instanceof Headers) {
      requestHeaders = Object.fromEntries(requestInit.headers.entries());
    } else if (typeof requestInit?.headers === 'object') {
      requestHeaders = requestInit.headers as Record<string, string>;
    } else {
      requestHeaders = requestInit?.headers ?? {};
    }
  }
  return {
    requestUrl,
    requestMethod,
    requestHeaders,
  };
};

export const interceptFetch = (
  ExtensionReceivedState: ExtensionReceivedState
) => {
  window.fetch = async (...args: [RequestInfo | URL, RequestInit?]) => {
    const { requestUrl, requestMethod, requestHeaders } = mapFetchArguments(
      ...args
    );
    const response = await originalFetch(...args);
    const clonedResponse = response.clone();
    // override the response body to be a string
    const matchedRule = ExtensionReceivedState.getState().ruleset.find(
      (rule) =>
        rule.enabled && rule.urlPattern && requestUrl.includes(rule.urlPattern)
    );
    if (matchedRule) {
      console.log('Matched rule:', matchedRule);
      const overrideBody = matchedRule.response ?? '{}';
      return new Response(overrideBody, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: clonedResponse.headers,
      });
    } else {
      console.log('No matching rule found for:', requestUrl);
      return response;
    }
  };

  const originalXhrOpen = XMLHttpRequest.prototype.open;
  const originalXhrSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async?: boolean,
    user?: string,
    password?: string
  ) {
    (this as any)._interceptRequestMethod = method;
    (this as any)._interceptRequestUrl = url.toString();
    return originalXhrOpen.apply(this, [method, url, async, user, password]);
  };

  XMLHttpRequest.prototype.send = function (...sendArgs: any[]) {
    const xhr = this;
    const handleReadyStateChange = function (this: XMLHttpRequest) {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const requestUrl =
          (xhr as any)._interceptRequestUrl || xhr.responseURL || '';
        const matchedRule = ExtensionReceivedState.getState().ruleset.find(
          (rule) =>
            rule.enabled &&
            rule.urlPattern &&
            requestUrl.includes(rule.urlPattern)
        );
        if (matchedRule) {
          console.log('Matched rule:', matchedRule);
          const overrideBody = matchedRule.response ?? '{}';
          Object.defineProperty(xhr, 'responseText', {
            configurable: true,
            writable: true,
            value: overrideBody,
          });
          Object.defineProperty(xhr, 'response', {
            configurable: true,
            writable: true,
            value: overrideBody,
          });
        } else {
          console.log('No matching rule found for:', requestUrl);
        }
        xhr.removeEventListener('readystatechange', handleReadyStateChange);
      }
    };
    xhr.addEventListener('readystatechange', handleReadyStateChange);
    return originalXhrSend.apply(this, sendArgs as any);
  };
};
