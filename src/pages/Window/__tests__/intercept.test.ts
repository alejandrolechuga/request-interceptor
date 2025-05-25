import { ExtensionReceivedState } from '../ExtensionReceivedState';
import MockXHR from '../../../__mocks__/mockXhr';

describe('interceptFetch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
  });

  it('overrides fetch response based on rules', async () => {
    const mockFetch = jest.fn().mockResolvedValue(new Response('original'));
    (globalThis as any).fetch = mockFetch;
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

  it('does not override fetch when rule is disabled', async () => {
    const mockFetch = jest.fn().mockResolvedValue(new Response('original'));
    (globalThis as any).fetch = mockFetch;
    const { interceptFetch } = require('../intercept');
    const state = new ExtensionReceivedState({
      ruleset: [
        {
          id: '1',
          urlPattern: '/test',
          method: 'GET',
          enabled: false,
          date: '',
          response: 'patched',
        },
      ],
    });
    interceptFetch(state);
    const res = await fetch('/test');
    const text = await res.text();
    expect(text).toBe('original');
  });

  it('overrides XMLHttpRequest response based on rules', () => {
    (globalThis as any).XMLHttpRequest = MockXHR as any;
    (globalThis as any).fetch = jest.fn();
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

  it('does not override XMLHttpRequest when rule is disabled', () => {
    (globalThis as any).XMLHttpRequest = MockXHR as any;
    (globalThis as any).fetch = jest.fn();
    const { interceptFetch } = require('../intercept');
    const state = new ExtensionReceivedState({
      ruleset: [
        {
          id: '1',
          urlPattern: '/xhr',
          method: 'GET',
          enabled: false,
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
        expect(xhr.responseText).toBe('original');
      }
    };
    xhr.send();
    jest.runAllTimers();
    expect(onReady).toHaveBeenCalled();
  });
});
