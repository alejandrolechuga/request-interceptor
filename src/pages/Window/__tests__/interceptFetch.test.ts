import { ExtensionReceivedState } from '../ExtensionReceivedState';
import type { Rule } from '../../../types/rule';
import { ExtensionMessageType } from '../../../types/runtimeMessage';

class FakeResponse {
  body: any;
  status: number;
  statusText: string;
  headers: any;
  constructor(
    body: any,
    init: { status: number; statusText?: string; headers?: any }
  ) {
    this.body = body;
    this.status = init.status;
    this.statusText = init.statusText ?? '';
    this.headers = init.headers;
  }
  clone() {
    return new FakeResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  }
  text() {
    return Promise.resolve(String(this.body));
  }
}

(globalThis as any).Response = FakeResponse;

jest.mock('../contentScriptMessage', () => ({
  postMessage: jest.fn(),
}));

describe('interceptFetch', () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock = jest.fn(() =>
      Promise.resolve(new Response('orig', { status: 200 }))
    );
    (globalThis as any).fetch = fetchMock;
    (globalThis as any).Request = class MockRequest {};
    jest.resetModules();
  });

  afterEach(() => {
    (globalThis as any).fetch = originalFetch;
    delete (globalThis as any).Request;
    jest.useRealTimers();
  });

  it('delays returning the overridden response', async () => {
    const { interceptFetch } = await import('../intercept');
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
          delayMs: 200,
        } as Rule,
      ],
    });
    interceptFetch(state);

    const resultPromise = fetch('/match');
    let resolved = false;
    resultPromise.then(() => {
      resolved = true;
    });

    await Promise.resolve();
    expect(resolved).toBe(false);
    jest.advanceTimersByTime(199);
    await Promise.resolve();
    expect(resolved).toBe(false);
    jest.advanceTimersByTime(1);
    const response = await resultPromise;
    expect(await response.text()).toBe('override');
    const { postMessage } = await import('../contentScriptMessage');
    expect((postMessage as jest.Mock).mock.calls[0][0]).toEqual({
      action: ExtensionMessageType.RULE_MATCHED,
      ruleId: '1',
    });
  });

  it('caps the delay at 10000ms', async () => {
    const { interceptFetch } = await import('../intercept');
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
          delayMs: 50000,
        } as Rule,
      ],
    });
    interceptFetch(state);

    const resultPromise = fetch('/match');
    let resolved = false;
    resultPromise.then(() => {
      resolved = true;
    });

    await Promise.resolve();
    jest.advanceTimersByTime(9999);
    await Promise.resolve();
    expect(resolved).toBe(false);
    jest.advanceTimersByTime(1);
    const response = await resultPromise;
    expect(await response.text()).toBe('override');
  });
});
