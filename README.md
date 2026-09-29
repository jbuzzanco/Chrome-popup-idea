# Keyword Detector Chrome Extension

A Chrome extension that detects specific keywords on webpages and displays popup notifications.

## Features

- 🔍 Detects keywords like "red" or "blue" on any webpage
- 🎨 Shows beautiful popup notifications when keywords are found
- ⚙️ Customizable keyword list through the extension popup
- 💾 Saves keyword preferences using Chrome storage
- 📱 Responsive and modern UI design

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this extension folder
4. The extension will appear in your Chrome toolbar

## How to Use

1. **Automatic Detection**: The extension automatically scans webpages for keywords as you browse
2. **Popup Notifications**: When keywords are found, a notification appears in the top-right corner of the page
3. **Extension Popup**: Click the extension icon to:
   - See which keywords were found on the current page
   - Customize your keyword list
   - Save new keyword preferences

## Default Keywords

The extension starts with these keywords:
- red
- blue

You can add or remove any keywords through the extension popup.

## Files Structure

```
keyword-detector-extension/
├── manifest.json       # Extension configuration
├── keywordMatcher.js   # Whole-word keyword matching
├── notification.js     # On-page notification
├── content.js          # Content script for page scanning
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality
├── background.js       # Background service worker
└── README.md           # This file
```

## Customization

### Adding New Keywords
1. Click the extension icon in your toolbar
2. Type your keywords (comma-separated) in the input field
3. Click "Save Keywords"

### Modifying Detection Logic
Edit `keywordMatcher.js` to change how keywords are matched, `content.js` to change when the page is scanned, and `notification.js` to change how notifications appear.

### Changing the UI
Edit `popup.html` and `popup.css` to customize the extension's appearance.

## Development Notes

- Uses Manifest V3 (latest Chrome extension standard)
- Implements content scripts for page scanning
- Uses Chrome storage API for persistence
- Features modern CSS with gradients and animations
- Responsive design works on different screen sizes

## Permissions

- `activeTab`: Access to the current tab content
- `storage`: Save user preferences
- `<all_urls>`: Run on all websites

Enjoy detecting keywords across the web! 🚀
