describe('interceptFetch', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  function setup() {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(new Response('orig', { status: 200 }));
    (global as any).fetch = fetchMock;

    const { default: FakeXHR } = require('../../__mocks__/fakeXHR');
    (global as any).XMLHttpRequest = FakeXHR as any;

    return { fetchMock };
  }

  it('overrides fetch and xhr responses', async () => {
    const { fetchMock } = setup();
    const { ExtensionReceivedState } = await import(
      '../ExtensionReceivedState'
    );
    const { interceptFetch } = await import('../intercept');

    const state = new ExtensionReceivedState({
      settings: { enableRuleset: true },
      ruleset: [
        {
          id: '1',
          urlPattern: '/test',
          method: 'GET',
          enabled: true,
          statusCode: 201,
          date: '',
          response: 'patched',
        },
      ],
    });

    interceptFetch(state);

    const res = await fetch('/test');
    expect(fetchMock).toHaveBeenCalled();
    expect(await res.text()).toBe('patched');
    expect(res.status).toBe(201);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/test');
    xhr.send();
    expect(xhr.responseText).toBe('patched');
    expect(xhr.status).toBe(201);
  });
});
