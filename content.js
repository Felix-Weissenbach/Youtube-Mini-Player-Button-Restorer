// YouTube Mini Player Button Restorer - Content Script
(function() {
    'use strict';

    let miniPlayerButton = null;
    let isVideoPage = false;

    function isYouTubeVideoPage() {
        return window.location.pathname === '/watch' && window.location.search.includes('v=');
    }

    function findControlsContainer() {
        // Try different selectors for YouTube's control bar
        const selectors = [
            '.ytp-right-controls',
            '.ytp-chrome-controls .ytp-right-controls',
            'div.ytp-right-controls'
        ];

        for (const selector of selectors) {
            const container = document.querySelector(selector);
            if (container) {
                return container;
            }
        }
        return null;
    }

    function triggerMiniPlayer() {
        // Simulate pressing the 'i' key which still works for mini player
        const video = document.querySelector('video');
        if (video) {
            const event = new KeyboardEvent('keydown', {
                key: 'i',
                code: 'KeyI',
                keyCode: 73,
                which: 73,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }
    }

    function createMiniPlayerButton() {
        if (miniPlayerButton) {
            return miniPlayerButton;
        }

        const button = document.createElement('button');
        button.className = 'ytp-miniplayer-button ytp-button youtube-mini-player-restore-btn';
        button.setAttribute('aria-label', 'Miniplayer (i)');
        button.setAttribute('title', 'Miniplayer (i)');
        button.setAttribute('data-title-no-tooltip', 'Miniplayer (i)');
        
        const img = document.createElement('img');
        img.src = browser.runtime.getURL('icons/miniplayer-icon.svg');
        img.alt = 'Mini Player';
        img.style.cssText = 'width: 24px; height: 24px; opacity: 1; pointer-events: none; display: block; object-fit: contain; filter: none;';

        button.appendChild(img);

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            triggerMiniPlayer();
        });

        miniPlayerButton = button;
        return button;
    }

    function addMiniPlayerButton() {
        if (!isYouTubeVideoPage() || miniPlayerButton) {
            return;
        }

        const controlsContainer = findControlsContainer();
        if (!controlsContainer) {
            // Try again after a short delay
            setTimeout(addMiniPlayerButton, 500);
            return;
        }

        // Check if button already exists
        if (document.querySelector('.youtube-mini-player-restore-btn')) {
            return;
        }

        const button = createMiniPlayerButton();
        
        // Insert the button between settings and theater mode buttons
        const theaterButton = controlsContainer.querySelector('.ytp-size-button');
        const settingsButton = controlsContainer.querySelector('.ytp-settings-button');
        const fullscreenButton = controlsContainer.querySelector('.ytp-fullscreen-button');
        
        if (theaterButton) {
            // Insert before theater mode button (after settings)
            controlsContainer.insertBefore(button, theaterButton);
        } else if (fullscreenButton) {
            controlsContainer.insertBefore(button, fullscreenButton);
        } else {
            controlsContainer.appendChild(button);
        }

        console.log('YouTube Mini Player button added!');
    }

    function removeMiniPlayerButton() {
        if (miniPlayerButton) {
            miniPlayerButton.remove();
            miniPlayerButton = null;
        }
    }

    function handlePageChange() {
        const wasVideoPage = isVideoPage;
        isVideoPage = isYouTubeVideoPage();

        if (isVideoPage && !wasVideoPage) {
            // Navigated to a video page
            setTimeout(addMiniPlayerButton, 1000); // Give YouTube time to load
        } else if (!isVideoPage && wasVideoPage) {
            // Navigated away from video page
            removeMiniPlayerButton();
        }
    }

    // Handle initial page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handlePageChange);
    } else {
        handlePageChange();
    }

    // Handle navigation changes (YouTube is a SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handlePageChange();
        }
    }).observe(document, { subtree: true, childList: true });

    // Also listen for YouTube's specific navigation events
    window.addEventListener('yt-navigate-finish', handlePageChange);
    window.addEventListener('yt-page-data-updated', handlePageChange);

    // Periodic check to ensure button exists (fallback)
    setInterval(() => {
        if (isYouTubeVideoPage() && !document.querySelector('.youtube-mini-player-restore-btn')) {
            addMiniPlayerButton();
        }
    }, 3000);

    // Handle keyboard shortcut (backup for 'i' key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'i' && isYouTubeVideoPage() && !e.ctrlKey && !e.metaKey && !e.altKey) {
            // Check if we're not in an input field
            const activeElement = document.activeElement;
            if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA' && !activeElement.isContentEditable)) {
                // Let the native 'i' key handler work
                return;
            }
        }
    });

})();
