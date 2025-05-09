chrome.devtools.panels.create(
  'Request interception tool',
  'icon-34.png',
  'panel.html', function (panel) {
    let backgroundPort = null;

    panel.onShown.addListener(function (window) {

      console.log("DevTools panel shown");
      if (!backgroundPort) {
        backgroundPort = window.chrome.runtime.connect({ name: "devtools-panel" });
        //window.alert("backgroundPort " + backgroundPort);
        backgroundPort.onMessage.addListener((message) => {
          alert("[DevTools Panel Received] : " + message.data.timestamp);
          console.log("[DevTools Panel Received]", message.data);

        });

        backgroundPort.onDisconnect.addListener(() => {
          console.log("DevTools panel disconnected from background");
          backgroundPort = null;
        });

        // Example: Sending a message to the background when a button is clicked
        const messageToSend = "message new to back";
        if (backgroundPort) {
          backgroundPort.postMessage({ action: "panel-to-background", data: messageToSend });
        }

      } else {
        console.log("DevTools panel already connected to background");
      }

    });

    panel.onHidden.addListener(() => {
      console.log("DevTools panel hidden");
      if (backgroundPort) {
        backgroundPort.disconnect();
        backgroundPort = null;
      }
    });

    chrome.devtools.inspectedWindow.eval("window.location.href", (url, err) => {
      chrome.runtime.sendMessage({
        target: "content-script",
        from: "devtools",
        data: "Hello from DevTools!",
        tabId: chrome.devtools.inspectedWindow.tabId
      });

    });


    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

      console.log("msg.from " + msg.from);
      if (msg.from === "content-script") {

        console.log("Reply from content script:", msg.data);
        alert("Reply from content script: " + msg.data);

      }
    });


  });

