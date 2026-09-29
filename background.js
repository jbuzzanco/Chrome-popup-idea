// Background script for handling extension events

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'KEYWORDS_FOUND') {
    console.log('Keywords found:', message.keywords, 'on:', message.url);
    
    // You could add more sophisticated notification logic here
    // For example, showing a Chrome notification or tracking statistics
    
    sendResponse({status: 'received'});
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Keyword Detector extension installed');
    
    // Set default keywords
    chrome.storage.sync.set({
      keywords: ['red', 'blue']
    }, () => {
      console.log('Default keywords set');
    });
  }
});

// Handle tab updates to re-run content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Content script will automatically run due to manifest configuration
  }
});
