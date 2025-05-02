chrome.devtools.panels.create(
  'Request interception tool',
  'icon-34.png',
  'panel.html', function (panel) {

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