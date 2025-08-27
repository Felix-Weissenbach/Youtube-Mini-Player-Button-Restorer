# YouTube Mini Player Button Restorer

A Chrome extension that brings back the missing mini player button on YouTube videos.

## Overview

YouTube recently removed the mini player button from their video controls, making it difficult for users to access the picture-in-picture functionality. While the keyboard shortcut `i` still works, many users prefer the visual button. This extension restores that functionality.

## Features

- ✅ Restores the mini player button to YouTube's video controls
- ✅ Maintains the original `i` keyboard shortcut functionality  
- ✅ Seamlessly integrates with YouTube's design language
- ✅ Works across all YouTube pages and navigation
- ✅ Lightweight and performance-optimized
- ✅ Chrome Web Store compliant

## Installation

### Option 1: Load as Unpacked Extension (For Development/Testing)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select the extension folder
4. The extension should now be active on YouTube

### Option 2: Chrome Web Store (When Published)

Install directly from the Chrome Web Store (link to be added when published).

## Usage

1. Navigate to any YouTube video
2. Look for the mini player button in the video controls (appears as a small screen icon)
3. Click the button or press `i` to activate the mini player
4. The video will switch to picture-in-picture mode

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Only requires `activeTab` and access to YouTube domains
- **Content Security Policy**: Compliant with Chrome Web Store requirements
- **Browser Compatibility**: Chrome 88+ (Manifest V3 requirement)

## File Structure

```
youtube-mini-player-extension/
├── manifest.json          # Extension configuration
├── content.js             # Main functionality script
├── styles.css             # Button styling
├── popup.html             # Extension popup interface
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
└── README.md              # This file
```

## How It Works

The extension uses a content script that:

1. Detects when you're on a YouTube video page
2. Finds the video controls container
3. Injects a properly styled mini player button
4. Handles click events by triggering the native `i` key functionality
5. Updates automatically when navigating between YouTube pages

## Privacy & Security

- **No data collection**: This extension doesn't collect any user data
- **Minimal permissions**: Only requests necessary permissions for YouTube functionality
- **Local operation**: All functionality runs locally in your browser
- **Open source**: Code is available for review and contribution

## Compatibility

- ✅ YouTube.com (all pages)
- ✅ YouTube embedded videos
- ✅ YouTube Music (where applicable)
- ✅ Dark and light themes
- ✅ All video qualities and formats
- ✅ Mobile responsive design

## Known Issues

- The button may take a moment to appear on very slow connections
- Some YouTube experiments/A-B tests might affect button placement temporarily

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the extension.

## License

This project is released under the MIT License. See LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Basic mini player button restoration
- Integration with existing `i` key functionality
- Chrome Web Store compliance

---

**Note**: This extension is not affiliated with YouTube or Google. It's a community-driven solution to restore removed functionality.
