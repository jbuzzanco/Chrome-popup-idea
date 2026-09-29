const notificationId = 'keyword-detector-notification';
const notificationStyleId = 'keyword-detector-style';
const hideAfterMs = 5000;

function addNotificationStyleOnce() {
  if (document.getElementById(notificationStyleId)) return;
  const style = document.createElement('style');
  style.id = notificationStyleId;
  style.textContent = `
    @keyframes keyword-detector-slide-in {
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
  (document.head || document.documentElement).appendChild(style);
}

function getNotificationText() {
  const notification = document.getElementById(notificationId);
  return notification ? notification.innerText : '';
}

function removeNotification() {
  const existingNotification = document.getElementById(notificationId);
  if (existingNotification) {
    existingNotification.remove();
  }
}

function createNotificationText(foundKeywords) {
  const text = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = '🔍 Keywords Found!';
  const detail = document.createElement('span');
  detail.style.opacity = '0.9';
  detail.textContent = 'Detected: ' + foundKeywords.join(', ');
  text.appendChild(title);
  text.appendChild(document.createElement('br'));
  text.appendChild(detail);
  return text;
}

function createCloseButton(notification) {
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    margin-left: 10px;
  `;
  closeButton.addEventListener('click', () => notification.remove());
  return closeButton;
}

function createNotification(foundKeywords) {
  const notification = document.createElement('div');
  notification.id = notificationId;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: keyword-detector-slide-in 0.3s ease-out;
  `;

  const row = document.createElement('div');
  row.style.cssText = 'display: flex; align-items: center; justify-content: space-between;';
  row.appendChild(createNotificationText(foundKeywords));
  row.appendChild(createCloseButton(notification));
  notification.appendChild(row);
  return notification;
}

function showNotification(foundKeywords) {
  addNotificationStyleOnce();
  removeNotification();

  const notification = createNotification(foundKeywords);
  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, hideAfterMs);
}

function isNotificationNode(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
  return node.id === notificationId
      || node.id === notificationStyleId
      || node.closest('#' + notificationId) !== null;
}
