import { ExtensionReceivedState } from './ExtensionReceivedState';
import {
  getOriginalFetch,
  setGlobalFetch,
} from '../../utils/globalFetch';
import {
  getOriginalXMLHttpRequest,
  setGlobalXMLHttpRequest,
} from '../../utils/globalXMLHttpRequest';
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
  const isEnabled = rule.enabled;
  const hasUrlPattern = !!rule.urlPattern;
  const urlMatches = params.requestUrl.includes(rule.urlPattern);
  const methodMatches =
    !rule.method ||
    rule.method.toUpperCase() === params.requestMethod.toUpperCase();

  if (isEnabled && hasUrlPattern && urlMatches && methodMatches) {
    const originalBody = response ? response.body : undefined;
    const overrideBody = rule.response ? rule.response : originalBody;
    // Use rule.statusCode if present, otherwise fallback to response.status
    const overrideStatus =
      typeof rule.statusCode === 'number'
        ? rule.statusCode
        : response
          ? response.status
          : 200;
    return new Response(overrideBody, {
      status: overrideStatus,
      statusText: response ? response.statusText : '',
      headers: response ? response.headers : undefined,
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

  const OriginalXHR = getOriginalXMLHttpRequest();

  class InterceptedXHR extends OriginalXHR {
    private _method = '';
    private _url = '';
    private _headers: Record<string, string> = {};

    open(
      method: string,
      url: string,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      this._method = method;
      this._url = url;
      return super.open(
        method,
        url,
        async ?? true,
        username ?? null,
        password ?? null
      );
    }

    override setRequestHeader(name: string, value: string) {
      this._headers[name] = value;
      return super.setRequestHeader(name, value);
    }

    send(body?: Document | XMLHttpRequestBodyInit | null) {
      const handleLoad = async () => {
        const rules = ExtensionReceivedState.getState().ruleset;
        let response = new Response(this.response);
        for (const rule of rules) {
          const overridden = applyRule(
            {
              requestUrl: this._url,
              requestMethod: this._method,
              requestHeaders: this._headers,
            },
            rule,
            response
          );
          if (overridden) {
            const text = await overridden.text();
            Object.defineProperty(this, 'response', { value: text });
            Object.defineProperty(this, 'responseText', { value: text });
            Object.defineProperty(this, 'status', { value: overridden.status });
            break;
          }
        }
      };

      this.addEventListener('load', handleLoad);
      return super.send(body);
    }
  }

  setGlobalXMLHttpRequest(InterceptedXHR as typeof XMLHttpRequest);
};
