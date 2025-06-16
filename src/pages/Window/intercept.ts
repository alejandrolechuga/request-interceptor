import { ExtensionReceivedState } from './ExtensionReceivedState';
import { getOriginalFetch, setGlobalFetch } from '../../utils/globalFetch';
import {
  getOriginalXMLHttpRequest,
  setGlobalXMLHttpRequest,
} from '../../utils/globalXMLHttpRequest';
import type { Rule } from '../../types/rule';
import { postMessage } from './contentScriptMessage';
import { ExtensionMessageType } from '../../types/runtimeMessage';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  let urlMatches = false;
  if (rule.isRegExp) {
    try {
      urlMatches = new RegExp(rule.urlPattern).test(params.requestUrl);
    } catch {
      urlMatches = false;
    }
  } else {
    urlMatches = params.requestUrl.includes(rule.urlPattern);
  }
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

export const applyXhrRule = (
  params: { requestUrl: string; requestMethod: string },
  rule: Rule,
  responseText: string
) => {
  const isEnabled = rule.enabled;
  const hasUrlPattern = !!rule.urlPattern;
  let urlMatches = false;
  if (rule.isRegExp) {
    try {
      urlMatches = new RegExp(rule.urlPattern).test(params.requestUrl);
    } catch {
      urlMatches = false;
    }
  } else {
    urlMatches = params.requestUrl.includes(rule.urlPattern);
  }
  const methodMatches =
    !rule.method ||
    rule.method.toUpperCase() === params.requestMethod.toUpperCase();

  if (isEnabled && hasUrlPattern && urlMatches && methodMatches) {
    return rule.response ?? responseText;
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
        if (rule.delayMs !== null && rule.delayMs !== undefined) {
          await wait(Math.min(10000, rule.delayMs));
        }
        postMessage({
          action: ExtensionMessageType.RULE_MATCHED,
          ruleId: rule.id,
        });
        return overridden;
      }
    }
    return response;
  });
};

export const interceptXhr = (
  ExtensionReceivedState: ExtensionReceivedState
) => {
  const OriginalXHR = getOriginalXMLHttpRequest();
  class PatchedXHR extends OriginalXHR {
    private _method = '';
    private _url = '';

    open(
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      this._method = method;
      this._url = typeof url === 'string' ? url : url.toString();
      if (typeof async === 'boolean') {
        super.open(method, url, async, username ?? null, password ?? null);
      } else {
        super.open(method, url, true, username ?? null, password ?? null);
      }
    }

    constructor() {
      super();
    }

    send(body?: Document | BodyInit | null) {
      const userReady = this.onreadystatechange;
      const userLoad = this.onload;

      this.onreadystatechange = null;
      this.onload = null;

      const callBuffered = () => {
        if (typeof userReady === 'function') {
          try {
            userReady.call(
              this,
              new Event('readystatechange') as ProgressEvent<EventTarget>
            );
          } catch {
            // ignore
          }
        }
        if (typeof userLoad === 'function') {
          try {
            userLoad.call(
              this,
              new Event('load') as ProgressEvent<EventTarget>
            );
          } catch {
            // ignore
          }
        }
      };

      const handleDone = () => {
        if (this.readyState === 4) {
          this.removeEventListener('readystatechange', handleDone);
          const rules = ExtensionReceivedState.getState().ruleset;
          for (const rule of rules) {
            let currentResponse = '';
            if (this.responseType === '' || this.responseType === 'text') {
              currentResponse = this.responseText;
            } else {
              try {
                currentResponse = JSON.stringify(this.response);
              } catch {
                currentResponse = '';
              }
            }
            const overridden = applyXhrRule(
              { requestUrl: this._url, requestMethod: this._method },
              rule,
              currentResponse
            );
            if (overridden !== undefined) {
              Object.defineProperty(this, 'responseText', {
                value: overridden,
              });
              Object.defineProperty(this, 'response', { value: overridden });
              postMessage({
                action: ExtensionMessageType.RULE_MATCHED,
                ruleId: rule.id,
              });
              const delay =
                rule.delayMs !== null && rule.delayMs !== undefined
                  ? Math.min(10000, rule.delayMs)
                  : 0;
              if (delay > 0) {
                setTimeout(callBuffered, delay);
              } else {
                callBuffered();
              }
              return;
            }
          }
          callBuffered();
        }
      };

      this.addEventListener('readystatechange', handleDone);
      super.send(body as any);
    }
  }

  setGlobalXMLHttpRequest(PatchedXHR as unknown as typeof XMLHttpRequest);
};

let patched = false;

export const isPatched = () => patched;

export const patch = (state: ExtensionReceivedState) => {
  if (patched) return;
  interceptFetch(state);
  interceptXhr(state);
  patched = true;
  sessionStorage.setItem('patched', 'true');
};

export const unpatch = () => {
  if (!patched) return;
  setGlobalFetch(getOriginalFetch());
  setGlobalXMLHttpRequest(getOriginalXMLHttpRequest());
  patched = false;
  sessionStorage.setItem('patched', 'false');
};

export const loadSession = (): { patched: boolean; ruleset: Rule[] } => {
  const storedPatched = sessionStorage.getItem('patched');
  const storedRules = sessionStorage.getItem('ruleset');
  let ruleset: Rule[] = [];
  if (storedRules) {
    try {
      ruleset = JSON.parse(storedRules) as Rule[];
    } catch {
      ruleset = [];
    }
  }
  return { patched: storedPatched === 'true', ruleset };
};

export const update = (state: ExtensionReceivedState) => {
  const {
    settings: { patched: isEnabled },
    ruleset,
  } = state.getState();
  sessionStorage.setItem('ruleset', JSON.stringify(ruleset));
  if (isEnabled) {
    patch(state);
  } else {
    unpatch();
  }
};

export const initialize = (state: ExtensionReceivedState) => {
  console.log('Initializing intercept...');
  const { patched: wasPatched, ruleset } = loadSession();
  if (ruleset.length) {
    state.updateState({ ruleset });
  }
  if (wasPatched) {
    patch(state);
  }
};
