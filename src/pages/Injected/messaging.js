
export const setup = () => {
    console.log('[injected.js] Running in the MAIN world');
    window.postMessage({
        source: 'devtools-response-overrider',    // custom identifier for your messages
        from: 'injected',
        type: 'init',
        payload: 'Hello from injected script'
    }, '*');

    window.addEventListener('message', function (event) {
        // Ensure the message is coming from the same window and intended for your extension
        if (event.source !== window || !event.data || event.data.source !== 'devtools-response-overrider') return;

        // Process only messages coming from the content script
        if (event.data.from === 'content-script') {
            console.log('[injected.js] Received message from content script:', event.data);
            // You can add further logic to act upon these messages.
        }
    });
}


