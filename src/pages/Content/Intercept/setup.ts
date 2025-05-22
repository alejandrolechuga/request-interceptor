import { InjectedEmittedEvents } from './InjectedEvents';
import { RequestHandler } from './RequestHandler';
import { RequestHandlerActions } from './RequestHandlerActions';
import { interceptFetch } from './intercept';
import { postMessage } from './contentScriptMessage';
import { RuntimeMessage } from '../../../types/messages';

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
  window.addEventListener('message', (event) => {
    if (
      event.source !== window ||
      !event.data ||
      event.data.source !== 'devtools-response-overrider' ||
      event.data.from !== 'content-script'
    )
      return;

    const message = event.data.payload;
    if (message.action === RuntimeMessage.SETTINGS_UPDATE) {
      console.log('Received settings update', message.settings);
    }
  });
  postMessage({
    action: InjectedEmittedEvents.INJECTED_READY,
    message: 'Injected page is ready',
  });
};
