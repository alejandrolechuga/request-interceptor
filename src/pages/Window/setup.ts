import { interceptFetch } from './intercept';
import {
  listenContentScriptMessages,
  postMessage,
} from './contentScriptMessage';
import {
  ExtensionReceivedState,
  ExtensionStateData,
  ExtensionStateEvents,
} from './ExtensionReceivedState';
import {
  ExtensionMessageType,
  ExtensionMessageOrigin,
} from '../../types/runtimeMessage';
export const setup = () => {
  const extensionStateReceiver = new ExtensionReceivedState();
  extensionStateReceiver.on(
    ExtensionStateEvents.STATE_UPDATED,
    (updatedState) => {
      if (updatedState) {
        console.log('[setup] ExtensionReceivedState updated:', updatedState);
      }
    }
  );
  postMessage({
    action: ExtensionMessageType.RECEIVER_READY,
  });
  listenContentScriptMessages((data) => {
    console.log('[setup] listenContentScriptMessages called with:', data);
    if (data?.action === ExtensionMessageType.STATE_UPDATE) {
      extensionStateReceiver.updateState({
        settings: data.state?.settings,
        ruleset: data.state?.ruleset,
      } as Partial<ExtensionStateData>);
    }
  });
  interceptFetch(extensionStateReceiver);
};
