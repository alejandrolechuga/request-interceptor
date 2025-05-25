export default class MockXHR {
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
