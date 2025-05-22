import { RuntimeMessage } from '../../types/messages';
import { listenInjectedScript } from './injectedMessaging';
import { listenContentScriptMessages } from './Intercept/contentScriptMessage';

listenInjectedScript();
listenContentScriptMessages(RuntimeMessage.SETTINGS_UPDATE, (message) => {
  console.log('Received settings update from panel:', message);
});
