const defaultKeywords = ['red', 'blue'];

document.addEventListener('DOMContentLoaded', function() {
  loadKeywords();

  document.getElementById('save-keywords').addEventListener('click', saveKeywords);

  document.getElementById('keyword-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveKeywords();
    }
  });
});

function loadKeywords() {
  chrome.storage.sync.get(['keywords'], function(result) {
    const keywords = result.keywords || defaultKeywords;
    document.getElementById('keyword-input').value = keywords.join(', ');
    checkCurrentPage(keywords);
  });
}

function readKeywordInput() {
  const input = document.getElementById('keyword-input').value;
  return input.split(',').map(k => k.trim()).filter(k => k.length > 0);
}

function showSavedFeedback() {
  const button = document.getElementById('save-keywords');
  const originalText = button.textContent;
  button.textContent = '✓ Saved!';
  button.style.background = 'rgba(76, 175, 80, 0.5)';

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = 'rgba(255, 255, 255, 0.3)';
  }, 1500);
}

function saveKeywords() {
  const keywords = readKeywordInput();

  chrome.storage.sync.set({keywords: keywords}, function() {
    showSavedFeedback();
    checkCurrentPage(keywords);
  });
}

function checkCurrentPage(keywords) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const message = {type: 'GET_FOUND_KEYWORDS', keywords: keywords};

    chrome.tabs.sendMessage(currentTab.id, message, function(response) {
      if (chrome.runtime.lastError || !response) {
        displayMessage('Reload this page to scan it', currentTab.url);
        return;
      }
      displayResults(response.keywords, currentTab.url);
    });
  });
}

function displayCurrentPage(url) {
  const currentPage = document.getElementById('current-page');
  const domain = url ? new URL(url).hostname : '';
  currentPage.textContent = `Current page: ${domain}`;
}

function createListItem(tagName, className, text) {
  const item = document.createElement(tagName);
  item.className = className;
  item.textContent = text;
  return item;
}

function displayMessage(text, url) {
  displayCurrentPage(url);
  const keywordList = document.getElementById('keyword-list');
  keywordList.replaceChildren(createListItem('div', 'no-keywords', text));
}

function displayResults(keywords, url) {
  if (keywords.length === 0) {
    displayMessage('No keywords found on this page', url);
    return;
  }

  displayCurrentPage(url);
  const keywordList = document.getElementById('keyword-list');
  const keywordTags = keywords.map(keyword => createListItem('span', 'keyword-tag', keyword));
  keywordList.replaceChildren(...keywordTags);
}
