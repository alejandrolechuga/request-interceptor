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
      const overrideStatus = matchedRule.statusCode ?? clonedResponse.status;
      return new Response(overrideBody, {
        status: overrideStatus,
        statusText: clonedResponse.statusText,
        headers: clonedResponse.headers,
      });
    } else {
      console.log('No matching rule found for:', requestUrl);
      return response;
    }
  };
};
