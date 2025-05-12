export const inject = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.bundle.js');
  script.onload = () => script.remove();
  script.onerror = () => {
    console.error('Error loading injected script');
  };
  (document.head || document.documentElement).appendChild(script);
};
