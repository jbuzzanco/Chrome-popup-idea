// Default keywords
const defaultKeywords = ['red', 'blue'];

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  loadKeywords();
  checkCurrentPage();
  
  // Save keywords button
  document.getElementById('save-keywords').addEventListener('click', saveKeywords);
  
  // Enter key in input field
  document.getElementById('keyword-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveKeywords();
    }
  });
});

// Load keywords from storage
function loadKeywords() {
  chrome.storage.sync.get(['keywords'], function(result) {
    const keywords = result.keywords || defaultKeywords;
    document.getElementById('keyword-input').value = keywords.join(', ');
  });
}

// Save keywords to storage
function saveKeywords() {
  const input = document.getElementById('keyword-input').value;
  const keywords = input.split(',').map(k => k.trim()).filter(k => k.length > 0);
  
  chrome.storage.sync.set({keywords: keywords}, function() {
    // Show success feedback
    const button = document.getElementById('save-keywords');
    const originalText = button.textContent;
    button.textContent = '✓ Saved!';
    button.style.background = 'rgba(76, 175, 80, 0.5)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = 'rgba(255, 255, 255, 0.3)';
    }, 1500);
    
    // Refresh content script on current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  });
}

// Check current page for keywords
function checkCurrentPage() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    // Get page content and check for keywords
    chrome.scripting.executeScript({
      target: {tabId: currentTab.id},
      function: checkPageForKeywords
    }, (results) => {
      if (results && results[0]) {
        displayResults(results[0].result, currentTab.url);
      }
    });
  });
}

// Function to be injected into the page
function checkPageForKeywords() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['keywords'], function(result) {
      const keywords = result.keywords || ['red', 'blue'];
      const pageText = document.body.innerText.toLowerCase();
      const foundKeywords = [];
      
      keywords.forEach(keyword => {
        if (pageText.includes(keyword.toLowerCase())) {
          foundKeywords.push(keyword);
        }
      });
      
      resolve(foundKeywords);
    });
  });
}

// Display results in popup
function displayResults(keywords, url) {
  const keywordList = document.getElementById('keyword-list');
  const currentPage = document.getElementById('current-page');
  
  // Show current page (truncated)
  const domain = new URL(url).hostname;
  currentPage.textContent = `Current page: ${domain}`;
  
  // Display keywords
  if (keywords.length > 0) {
    keywordList.innerHTML = keywords.map(keyword => 
      `<span class="keyword-tag">${keyword}</span>`
    ).join('');
  } else {
    keywordList.innerHTML = '<div class="no-keywords">No keywords found on this page</div>';
  }
}
