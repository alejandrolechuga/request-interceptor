import { ExtensionReceivedState } from '../ExtensionReceivedState';
import type { Rule } from '../../../types/rule';
import { setGlobalXMLHttpRequest } from '../../../utils/globalXMLHttpRequest';

jest.mock('../../../utils/globalFetch', () => {
  return {
    getOriginalFetch: jest.fn(() => (globalThis as any).fetch),
    setGlobalFetch: jest.fn(),
  };
});

const openMock = jest.fn();

class FakeXMLHttpRequest {
  readyState = 0;
  responseType = '';
  private _responseText = 'orig';
  private _response: any = 'orig';
  listeners: Record<string, Array<() => void>> = {};

  open(
    method: string,
    url: string,
    async?: boolean,
    username?: string | null,
    password?: string | null
  ) {
    openMock(method, url, async, username, password);
  }

  addEventListener(event: string, cb: () => void) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(cb);
  }

  send() {
    this.readyState = 4;
    const handlers = this.listeners['readystatechange'] || [];
    handlers.forEach((cb) => cb.call(this));
  }

  simulateResponse(type: string, resp: any) {
    this.responseType = type;
    this._response = resp;
    this._responseText = typeof resp === 'string' ? resp : JSON.stringify(resp);
  }

  get response() {
    return this._response;
  }
  set response(val: any) {
    this._response = val;
  }

  get responseText() {
    if (this.responseType !== '' && this.responseType !== 'text') {
      throw new Error('InvalidStateError');
    }
    return this._responseText;
  }
  set responseText(val: string) {
    this._responseText = val;
  }
}

jest.mock('../../../utils/globalXMLHttpRequest', () => {
  return {
    getOriginalXMLHttpRequest: jest.fn(() => FakeXMLHttpRequest),
    setGlobalXMLHttpRequest: jest.fn((ctor: typeof XMLHttpRequest) => {
      (globalThis as any).XMLHttpRequest = ctor;
    }),
    getGlobalXMLHttpRequest: jest.fn(() => globalThis.XMLHttpRequest),
  };
});

describe('interceptXhr', () => {
  beforeEach(() => {
    (globalThis as any).XMLHttpRequest = FakeXMLHttpRequest as any;
    jest.resetModules();
    openMock.mockClear();
  });

  it('patch and unpatch swap the global constructor', async () => {
    const { patch, unpatch } = await import('../intercept');
    const state = new ExtensionReceivedState();
    const originalCtor = globalThis.XMLHttpRequest;
    patch(state);
    expect(globalThis.XMLHttpRequest).not.toBe(originalCtor);
    unpatch();
    expect(globalThis.XMLHttpRequest).toBe(originalCtor);
  });

  it('forwards username and password when async is omitted', async () => {
    const { interceptXhr } = await import('../intercept');
    const state = new ExtensionReceivedState();
    interceptXhr(state);
    const XhrCtor =
      globalThis.XMLHttpRequest as unknown as typeof FakeXMLHttpRequest;
    const xhr = new XhrCtor();
    xhr.open('GET', '/open', undefined, 'user', 'pass');
    expect(openMock).toHaveBeenCalledWith('GET', '/open', true, 'user', 'pass');
  });

  it('overrides response when rule matches even for json', async () => {
    const { interceptXhr } = await import('../intercept');
    const state = new ExtensionReceivedState({
      ruleset: [
        {
          id: '1',
          urlPattern: '/match',
          isRegExp: false,
          method: 'GET',
          enabled: true,
          statusCode: 200,
          date: '',
          response: 'override',
        } as Rule,
      ],
    });
    interceptXhr(state);
    const XhrCtor =
      globalThis.XMLHttpRequest as unknown as typeof FakeXMLHttpRequest;
    const xhr: any = new XhrCtor();
    xhr.open('GET', '/match');
    xhr.simulateResponse('json', { ok: true });
    expect(() => xhr.send()).not.toThrow();
    expect(xhr.responseText).toBe('override');
    expect(xhr.response).toBe('override');
  });
});
