import { describe, it, expect } from '@jest/globals';

describe('interceptXhr', () => {
  it('overrides responseText for matching rule', async () => {
    const original = window.XMLHttpRequest;

    class FakeOriginalXHR extends EventTarget {
      readyState = 0;
      responseText = '';
      response: any = null;
      method = '';
      url = '';
      open(method: string, url: string) {
        this.method = method;
        this.url = url;
      }
      send() {
        this.responseText = 'orig';
        this.response = 'orig';
        this.readyState = 4;
        this.dispatchEvent(new Event('readystatechange'));
      }
    }

    await jest.isolateModulesAsync(async () => {
      (window as any).XMLHttpRequest = FakeOriginalXHR as any;
      const { interceptXhr } = await import('../intercept');
      const { ExtensionReceivedState } = await import(
        '../ExtensionReceivedState'
      );
      const { getGlobalXMLHttpRequest } = await import(
        '../../../utils/globalXMLHttpRequest'
      );

      const state = new ExtensionReceivedState({
        settings: { patched: true },
        ruleset: [
          {
            id: '1',
            urlPattern: '/match',
            isRegExp: false,
            method: 'GET',
            enabled: true,
            date: '',
            response: 'override',
            statusCode: 200,
          },
        ],
      });
      interceptXhr(state);
      const Patched = getGlobalXMLHttpRequest();
      expect(Patched).not.toBe(FakeOriginalXHR);
      const xhr = new Patched();
      xhr.open('GET', '/match');
      xhr.send();
      expect(xhr.responseText).toBe('override');
    });

    window.XMLHttpRequest = original;
  });
});
