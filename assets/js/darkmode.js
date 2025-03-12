// Dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    
    // Remove the no-transition class after the page has loaded
    // This allows transitions to work normally after initial load
    setTimeout(function() {
        htmlElement.classList.remove('no-transition-on-load');
    }, 100);
    
    // Check if user preference is stored
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply dark mode if previously selected
    if (isDarkMode) {
        htmlElement.classList.add('dark');
    }
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function() {
        htmlElement.classList.toggle('dark');
        
        // Store user preference
        const isDarkModeNow = htmlElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDarkModeNow);
    });
    
    // Also check for system preference on first load if no preference is stored
    if (localStorage.getItem('darkMode') === null) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            htmlElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        }
    }
    
    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (localStorage.getItem('darkMode') === null) { // Only auto-switch if user hasn't set preference
                if (event.matches) {
                    htmlElement.classList.add('dark');
                } else {
                    htmlElement.classList.remove('dark');
                }
            }
        });
    }
});