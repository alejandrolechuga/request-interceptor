import { printLine } from './modules/print';

// Inject into page (MAIN world)

import injectedCode from '!!raw-loader!injected.bundle.js'; // or wherever

const script = document.createElement('script');
script.textContent = injectedCode; // ✅ inline JS string
(document.head || document.documentElement).appendChild(script);

// const script = document.createElement('script');
// script.src = chrome.runtime.getURL('injected.bundle.js');
// script.onload = () => script.remove();
// (document.head || document.documentElement).appendChild(script);

console.log("chrome ", chrome.runtime);

window.addEventListener('message', function (event) {
    // Filter out any messages not sent by our extension code
    if (event.source !== window || !event.data || event.data.source !== 'devtools-response-overrider') return;

    // Process messages coming from the injected script
    if (event.data.from === 'injected' && event.data.type === 'init') {
        console.log('[content script] Received message from injected script:', event.data.payload);

        // Reply back to the injected script
        window.postMessage({
            source: 'devtools-response-overrider',
            from: 'content-script',
            type: 'response',
            payload: 'Hello back from content script'
        }, '*');
    }
});

