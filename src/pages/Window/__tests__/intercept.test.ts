import { ExtensionReceivedState } from '../ExtensionReceivedState';

class MockXHR {
  public readyState = 0;
  public responseText = '';
  public response: any = '';
  public status = 0;
  public onreadystatechange: (() => void) | null = null;
  public responseURL = '';
  private listeners: Record<string, Array<() => void>> = {};

  open(method: string, url: string) {
    this.responseURL = url;
    this.readyState = 1;
  }

  send() {
    setTimeout(() => {
      this.readyState = 4;
      this.status = 200;
      this.response = 'original';
      this.responseText = 'original';
      if (this.onreadystatechange) {
        this.onreadystatechange();
      }
      this.dispatchEvent('readystatechange');
    }, 0);
  }

  addEventListener(event: string, cb: () => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  }

  removeEventListener(event: string, cb: () => void) {
    const arr = this.listeners[event];
    if (arr) {
      this.listeners[event] = arr.filter((fn) => fn !== cb);
    }
  }

  private dispatchEvent(event: string) {
    const arr = this.listeners[event];
    if (arr) arr.forEach((fn) => fn.call(this));
  }
}

describe('interceptFetch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
  });

  it('overrides fetch response based on rules', async () => {
    const mockFetch = jest.fn().mockResolvedValue(new Response('original'));
    (global as any).fetch = mockFetch;
    const { interceptFetch } = require('../intercept');
    const state = new ExtensionReceivedState({
      ruleset: [
        {
          id: '1',
          urlPattern: '/test',
          method: 'GET',
          enabled: true,
          date: '',
          response: 'patched',
        },
      ],
    });
    interceptFetch(state);
    const res = await fetch('/test');
    const text = await res.text();
    expect(text).toBe('patched');
  });

  it('overrides XMLHttpRequest response based on rules', () => {
    (global as any).XMLHttpRequest = MockXHR as any;
    (global as any).fetch = jest.fn();
    const { interceptFetch } = require('../intercept');
    const state = new ExtensionReceivedState({
      ruleset: [
        {
          id: '1',
          urlPattern: '/xhr',
          method: 'GET',
          enabled: true,
          date: '',
          response: 'patched',
        },
      ],
    });
    interceptFetch(state);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/xhr');
    const onReady = jest.fn();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        onReady();
        expect(xhr.responseText).toBe('patched');
      }
    };
    xhr.send();
    jest.runAllTimers();
    expect(onReady).toHaveBeenCalled();
  });
});
