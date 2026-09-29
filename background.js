chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'KEYWORDS_FOUND') {
    console.log('Keywords found:', message.keywords, 'on:', message.url);
    sendResponse({status: 'received'});
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Keyword Detector extension installed');

    chrome.storage.sync.set({
      keywords: ['red', 'blue']
    }, () => {
      console.log('Default keywords set');
    });
  }
});
