import { InjectedEmittedEvents } from './InjectedEvents';
import { RequestHandler } from './RequestHandler';
import { RequestHandlerActions } from './RequestHandlerActions';
import { interceptFetch } from './intercept';
import { postMessage } from './contentScriptMessage';

export const setup = () => {
  const requestHandler = new RequestHandler();
  requestHandler.on(
    RequestHandlerActions.REQUEST_RECORDS_UPDATE,
    (requests) => {
      postMessage({
        action: InjectedEmittedEvents.REQUEST_RECORDS_UPDATE,
        requests,
      });
    }
  );
  interceptFetch(requestHandler);
  postMessage({
    action: InjectedEmittedEvents.INJECTED_READY,
    message: 'Injected page is ready',
  });
};
