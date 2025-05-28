export default class FakeXHR {
  onload: (() => void) | null = null;
  onreadystatechange: (() => void) | null = null;
  readyState = 0;
  status = 200;
  response: any = 'orig';
  responseText: any = 'orig';
  private method = '';
  private url = '';
  private headers: Record<string, string> = {};

  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  addEventListener(event: string, cb: () => void) {
    if (event === 'load') this.onload = cb;
    if (event === 'readystatechange') this.onreadystatechange = cb;
  }

  send() {
    this.readyState = 4;
    if (this.onreadystatechange) this.onreadystatechange();
    if (this.onload) this.onload();
  }
}
