import { RequestHandler } from './RequestHandler';
import { RequestHandlerActions } from './RequestHandlerActions';
import { interceptFetch } from './intercept';

export const setup = () => {
  const requestHandler = new RequestHandler();
  requestHandler.on(
    RequestHandlerActions.REQUEST_RECORDS_UPDATE,
    (requests) => {
      console.log('Request record added:', requests);

      postMessage({
        type: 'requestRecordUpdated',
        requests,
      });
    }
  );
  interceptFetch(requestHandler);
};
