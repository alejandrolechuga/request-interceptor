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
};

let patched = false;

export const isPatched = () => patched;

export const patch = (state: ExtensionReceivedState) => {
  if (patched) return;
  interceptFetch(state);
  patched = true;
  sessionStorage.setItem('patched', 'true');
};

export const unpatch = () => {
  if (!patched) return;
  setGlobalFetch(getOriginalFetch());
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
    settings: { enableRuleset },
    ruleset,
  } = state.getState();
  sessionStorage.setItem('ruleset', JSON.stringify(ruleset));
  if (enableRuleset) {
    patch(state);
  } else {
    unpatch();
  }
};

export const initialize = (state: ExtensionReceivedState) => {
  const { patched: wasPatched, ruleset } = loadSession();
  if (ruleset.length) {
    state.updateState({ ruleset });
  }
  if (wasPatched) {
    patch(state);
  }
};
