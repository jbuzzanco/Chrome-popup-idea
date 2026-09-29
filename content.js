// Keywords to detect
const keywords = ['red', 'blue'];

// Function to check if keywords exist in page text
function checkForKeywords() {
  const pageText = document.body.innerText.toLowerCase();
  const foundKeywords = [];
  
  keywords.forEach(keyword => {
    if (pageText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });
  
  if (foundKeywords.length > 0) {
    // Send message to background script
    chrome.runtime.sendMessage({
      type: 'KEYWORDS_FOUND',
      keywords: foundKeywords,
      url: window.location.href
    });
    
    // Create a simple notification popup on the page
    showPageNotification(foundKeywords);
  }
}

// Function to show a notification on the page
function showPageNotification(keywords) {
  // Remove existing notification if present
  const existingNotification = document.getElementById('keyword-detector-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'keyword-detector-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <strong>🔍 Keywords Found!</strong><br>
        <span style="opacity: 0.9;">Detected: ${keywords.join(', ')}</span>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
      ">×</button>
    </div>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Run check when page loads
checkForKeywords();

// Also check when page content changes (for dynamic content)
const observer = new MutationObserver((mutations) => {
  checkForKeywords();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
