// Script to handle dark mode for social media embeds

document.addEventListener('DOMContentLoaded', function() {
    // Function to inject CSS into iframes
    function injectCSSIntoIframes() {
        // Find all iframes that are Twitter/X embeds
        const twitterIframes = document.querySelectorAll('iframe[src*="twitter"], iframe[src*="x.com"]');
        
        twitterIframes.forEach(iframe => {
            // When iframe loads, attempt to inject CSS for dark mode
            iframe.addEventListener('load', function() {
                try {
                    // Check if we're in dark mode
                    const isDarkMode = document.documentElement.classList.contains('dark');
                    
                    if (isDarkMode) {
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        
                        // Create a style element
                        const style = iframeDocument.createElement('style');
                        style.textContent = `
                            :root {
                                color-scheme: dark !important;
                            }
                            body {
                                background-color: #1a1a1a !important;
                                color: #e2e2e2 !important;
                            }
                            .r-16dba41 {
                                background-color: #1a1a1a !important;
                            }
                            .r-q4m81j {
                                border-color: #333 !important;
                            }
                            p, span, div {
                                color: #e2e2e2 !important;
                            }
                            a {
                                color: #1d9bf0 !important;
                            }
                        `;
                        
                        // Inject it into the iframe's document
                        iframeDocument.head.appendChild(style);
                    }
                } catch (e) {
                    // Cross-origin restrictions may prevent this from working
                    // We have CSS fallbacks in place
                    console.log('Unable to modify iframe content due to cross-origin policy');
                }
            });
        });
    }
    
    // Run once on page load
    injectCSSIntoIframes();
    
    // Apply a special class to embed cards
    const embedCards = document.querySelectorAll('.kg-embed-card');
    embedCards.forEach(card => {
        if (card.querySelector('iframe[src*="twitter"], iframe[src*="x.com"]')) {
            card.setAttribute('data-card-type', 'embed');
        }
    });
    
    // Create a MutationObserver to watch for newly added Twitter embeds
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check if any of the added nodes are Twitter embeds
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'IFRAME' && 
                            (node.src.includes('twitter') || node.src.includes('x.com'))) {
                            injectCSSIntoIframes();
                        }
                        
                        // Also check children of this node
                        const iframes = node.querySelectorAll('iframe[src*="twitter"], iframe[src*="x.com"]');
                        if (iframes.length > 0) {
                            injectCSSIntoIframes();
                        }
                    }
                });
            }
        });
    });
    
    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Listen for dark mode toggle
    document.getElementById('darkModeToggle')?.addEventListener('click', function() {
        // Wait for the DOM to update after toggling dark mode
        setTimeout(injectCSSIntoIframes, 100);
    });
    
    document.getElementById('darkModeToggleMobile')?.addEventListener('click', function() {
        // Wait for the DOM to update after toggling dark mode
        setTimeout(injectCSSIntoIframes, 100);
    });
});
