console.log('This is the background page.');
console.log('Put the background scripts here.');



//chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

// console.log("send data to ", message.target + " ", message.tabId + " : ", message);
/* if (message.target === "content-script") {
     console.log(" content-script  message ---------> ", message);
     chrome.tabs.sendMessage(message.tabId, message);
 }
 
 if (message.target === "devtools") {
     console.log(" devtools  message ---------> ", message);
     chrome.runtime.sendMessage(message);
 }
 
 if (message.from === 'devtools' && message.tabId) {
     console.log(`Background received from DevTools (Tab ${message.tabId}):`, message);
     // Send a response back to the DevTools panel
     sendResponse({ status: 'Message received by background' });
     console.log("sent msg from back to devtools");
 }
 */
/*  chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
          console.error("Error sending message to tab " + tabId + ":", chrome.runtime.lastError);
      } else {
          console.log("Response from content script (tab " + tabId + "):", response);
      }
  }); */


//});


let devToolsPort = null;

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "devtools-panel") {
        devToolsPort = port;
        console.log("Background script connected to DevTools panel");
        devToolsPort.onMessage.addListener((message) => {
            console.log("[Background Received]", message);
            // Process the message from the DevTools panel
            if (message.action === "panel-to-background") {
                console.log("Background received data:", message.data);
                // Perform some background task based on the received data
                const responseData = {
                    processed: true,
                    receivedData: message.data,
                    timestamp: Date.now()
                };
                // Send a response back to the DevTools panel
                if (devToolsPort) {
                    devToolsPort.postMessage({ action: "background-to-panel", data: responseData });
                }
            }
        });

        devToolsPort.onDisconnect.addListener(() => {
            console.log("Background script disconnected from DevTools panel");
            devToolsPort = null;
        });

        // Example: Sending data to the DevTools panel periodically
        setInterval(() => {
            const backgroundData = {
                timestamp: Date.now(),
                status: 'active',
                randomValue: Math.random()
            };
            if (devToolsPort) {
                devToolsPort.postMessage({ action: "background-to-panel", data: backgroundData });
            }


        }, 3000);
    }
});
