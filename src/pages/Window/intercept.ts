import { ExtensionReceivedState } from './ExtensionReceivedState';
import { getOriginalFetch, setGlobalFetch } from '../../utils/globalFetch';
import type { Rule } from '../../types/rule';

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

export const applyRule = (
  params: {
    requestUrl: string;
    requestMethod: string;
    requestHeaders: Record<string, string>;
  },
  rule: Rule,
  response: Response
) => {
  if (
    rule.enabled &&
    rule.urlPattern &&
    params.requestUrl.includes(rule.urlPattern)
  ) {
    const overrideBody = rule.response ?? '{}';
    return new Response(overrideBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }
  return undefined;
};

export const interceptFetch = (
  ExtensionReceivedState: ExtensionReceivedState
) => {
  setGlobalFetch(async (...args: [RequestInfo | URL, RequestInit?]) => {
    const { requestUrl, requestMethod, requestHeaders } = mapFetchArguments(
      ...args
    );
    const response = await getOriginalFetch()(...args);
    const clonedResponse = response.clone();
    const rules = ExtensionReceivedState.getState().ruleset;
    for (const rule of rules) {
      const overridden = applyRule(
        { requestUrl, requestMethod, requestHeaders },
        rule,
        clonedResponse
      );
      if (overridden) {
        return overridden;
      }
    }
    return response;
  });
};
