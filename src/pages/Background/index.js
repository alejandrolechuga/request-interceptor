console.log('This is the background page.');
console.log('Put the background scripts here.');



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("message.target " + message.target);
    if (message.target === "content-script") {
        console.log(message.tabId + " : ", message);
        chrome.tabs.sendMessage(message.tabId, message);


    } else if (message.target === "devtools") {
        console.log(message.tabId + " : ", message);
        chrome.runtime.sendMessage(message);

    }
});



