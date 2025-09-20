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
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACQFBMVEUAAADl4d7U08/U08/Z2NTU0s7U08/JycXW1dHT0s7W1dHV1NDU08/X1tHT0s/V09DV1NDU08/X1tHT0s7V1NDV1NDU08/X1tLT0s/V1NDV1NDU08/X1tLT0s7V1dHU1NDU08/X1tLT0s7U1NDU1NDV1NDV1NDT0s7V1NDU1NDZ19PT0s7U08/MzMnT08/V1NDV1NDa2NTS0c7U08/NzcrT0s7W1dHU1NDa2NTS0s7U08/U08/U08/NzsrT0s7U1M/X1tLW1tHU08/MzcrY1tPU08/U08/JycbW1dHU08/U089GR0bV08/U08/U08/U08/U08/U08/U08/U08/U08/U08/U08/U08/U08/V08/U08/U08/U08/T0s7T0s7U0s7U087T0s7T0s7T0s7U08/U08/V1NDV1NDU08/U1M/X19LV1NDV1NDU08/U1M/Y19PV1NDV1NDU08/U1M/X19PU1NDU1NDU08/U08/X19PU1NDU1NDU08/U1M/Y19PU1NDU1NDV1NDV1NDU1NDV1NDV1dHV1dDU1NDU1NDV1NDU08/U08/U08/U08/U1NDV1NDV1NDV1NDU08/U08/U08/U08/U1NDU1NDU1NDV1NDU08/U08/U1M/U1M/U1M/U08/U08/U08/U08/U08/U08/U08/U1M/U08/U08/U08/V1M/U08/U08/U08/U08/U08/U08/U08/U08/U08/U08/T08/T08/U08/U08/U08/U08/U08/U08/U08/U088AAACW6cTSAAAAv3RSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIHN9fX19fX19fX12Jnt3R0lJSUlJSUlHcYWFNzCNAoU3MI0ChTcwjQKFNzCNAoU3MI0ChTcGDz+WEwSFN2WinK6kV4U3gkwLClR0hTeBP0lzgGs2OTk5OTk4mz9KdCqBhoaGhoaGhbOhiIimZxMxMjIwD7JkUrcAAAABYktHRACIBR1IAAAAB3RJTUUH6QgbASM43Z7efQAAAQFJREFUKM9jYBhYwMjk4+vnHxAYFBwSGhYewcwCk2Bli4yKjomNi09ITEpOSWXngElwcqWlc0PZPBmZWbwwCT7+7BwBKFswNy9fCCYhLFJQKAplixUVl4jDJCQkS8ukoGzp8opKGZiErFxVtTyUrVBTW6cIk1BSrm9QAbNUG5uaW1rb1KAS6hrtHZoghpZ2Z1d3T2+fji5EQk+/f4IBiGFoNHHS5ClTpxmbQCRMzabPMAcxLCxnzrKynj3HxhYiYWc/d978BQsXLV6ydNlyB8cVK52cIRIurqtWr1m7bv2GjZs2b9m6bfsON3e00PTw3Llr9569+7woiRJvICBNAgsAAGIJSO9dgEIEAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTA4LTI3VDAxOjM2OjMwKzAxOjAwGChLQAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wOC0yN1QwMTozNTo1NiswMTowMCf9dEIAAAAASUVORK5CYII="';
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
