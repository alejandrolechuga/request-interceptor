import { EventBus } from '../../utils/EventBus';
import { RequestHandlerActions } from './RequestHandlerActions';
type RequestRecord = {
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    // body: string;
  };
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
  };
};

interface RequestHandlerEventMap {
  [RequestHandlerActions.REQUEST_RECORDS_UPDATE]: RequestRecord[];
}

export class RequestHandler extends EventBus<RequestHandlerEventMap> {
  private requests: RequestRecord[] = [];
  constructor() {
    super();
  }
  public addRequest(request: RequestRecord) {
    this.requests.push(request);
    this.emit(RequestHandlerActions.REQUEST_RECORDS_UPDATE, this.requests);
  }
}
