import { printLine } from './modules/print';

// This keeps track of the origal js HTTP request functions
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    printLine('fetch', args);
    const response = await originalFetch(...args);
    if (!response.body) {
        console.log("Response has no body.");
        return null;
    }
    console.log("response ", response);
    // apply rule here
    const hardcodedResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // todo here add rule matching
    return new Response(JSON.stringify({ test: "hola" }), hardcodedResponse);
};

// Inject into page (MAIN world)
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

console.log("chrome ", chrome.runtime);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.from === "devtools") {
        console.log("Message from DevTools:", msg.data);
        console.log("msg ", msg);
        // Respond
        chrome.runtime.sendMessage({
            target: "devtools",
            from: "content-script",
            data: "Received your message!",
            tabId: msg.tabId
        }, (response) => {
            // Optional: Handle the response from the background script
            if (response) {
                console.log('Background response:', response);
            }
        });
    }


});

