import { RequestHandler } from './RequestHandler';

const originalFetch = window.fetch;
const mapFetchArguments = (...args: any[]) => {
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

export const interceptFetch = (requestHandler: RequestHandler) => {
  window.fetch = async (...args: any[]) => {
    const { requestUrl, requestMethod, requestHeaders } = mapFetchArguments(
      ...args
    );
    const response = await originalFetch(...args);
    const clonedResponse = response.clone();
    requestHandler.addRequest({
      request: {
        url: requestUrl,
        method: requestMethod,
        headers: requestHeaders,
      },
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: await clonedResponse.text(),
      },
    });
    return response;
  };
};
