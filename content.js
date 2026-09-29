const defaultKeywords = ['red', 'blue'];
const scanDelayMs = 500;
const maxWaitMs = 3000;

let keywords = defaultKeywords;
let lastFoundKey = '';
let scanTimer = null;
let firstRequestAt = 0;

function getPageText() {
  return document.body.innerText.replace(getNotificationText(), '');
}

function findKeywordsOnPage(keywordList) {
  return findKeywordsInText(keywordList, getPageText());
}

function notifyBackground(foundKeywords) {
  try {
    chrome.runtime.sendMessage({
      type: 'KEYWORDS_FOUND',
      keywords: foundKeywords,
      url: window.location.href
    }).catch(() => {});
  } catch (error) {
    return;
  }
}

function scanPage() {
  const foundKeywords = findKeywordsOnPage(keywords);
  const foundKey = foundKeywords.join('|');
  if (foundKey === lastFoundKey) return;
  lastFoundKey = foundKey;

  if (foundKeywords.length > 0) {
    notifyBackground(foundKeywords);
    showNotification(foundKeywords);
  } else {
    removeNotification();
  }
}

function scheduleScan() {
  const now = Date.now();
  if (scanTimer === null) {
    firstRequestAt = now;
  }
  clearTimeout(scanTimer);

  const timeUntilMaxWait = firstRequestAt + maxWaitMs - now;
  const delay = Math.max(0, Math.min(scanDelayMs, timeUntilMaxWait));
  scanTimer = setTimeout(() => {
    scanTimer = null;
    scanPage();
  }, delay);
}

function isOwnMutation(mutation) {
  const target = mutation.target.nodeType === Node.ELEMENT_NODE
    ? mutation.target
    : mutation.target.parentElement;
  if (isNotificationNode(target)) return true;

  const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
  return changedNodes.length > 0 && changedNodes.every(isNotificationNode);
}

chrome.storage.sync.get(['keywords'], (result) => {
  if (Array.isArray(result.keywords)) {
    keywords = result.keywords;
  }
  scheduleScan();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.keywords) {
    const savedKeywords = changes.keywords.newValue;
    keywords = Array.isArray(savedKeywords) ? savedKeywords : defaultKeywords;
    lastFoundKey = null;
    scheduleScan();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_FOUND_KEYWORDS') {
    const keywordList = Array.isArray(message.keywords) ? message.keywords : keywords;
    sendResponse({keywords: findKeywordsOnPage(keywordList)});
  }
});

const observer = new MutationObserver((mutations) => {
  if (mutations.some((mutation) => !isOwnMutation(mutation))) {
    scheduleScan();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
