// Enhanced mobile carousel experience
document.addEventListener('DOMContentLoaded', function() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselHint = document.querySelector('.carousel-nav-hint');
    
    if (!carouselWrapper || !carouselHint) return;
    
    // Only show the hint on mobile if they haven't seen it before
    if (window.innerWidth <= 768 && !localStorage.getItem('carouselHintSeen')) {
        carouselHint.classList.remove('hidden');
        carouselHint.classList.add('flex');
        
        // Mark as seen after the animation plays once
        setTimeout(() => {
            localStorage.setItem('carouselHintSeen', 'true');
            
            // Fade out hint
            carouselHint.style.transition = 'opacity 0.5s ease-out';
            carouselHint.style.opacity = '0';
            
            setTimeout(() => {
                carouselHint.classList.add('hidden');
            }, 500);
        }, 5000);
    }
    
    // Make sure scroll is smooth on touch devices
    if ('ontouchstart' in window) {
        carouselWrapper.style.webkitOverflowScrolling = 'touch';
        
        // Add indicators when scrolling approaches the end
        carouselWrapper.addEventListener('scroll', function() {
            const maxScroll = carouselWrapper.scrollWidth - carouselWrapper.clientWidth;
            const currentScroll = carouselWrapper.scrollLeft;
            
            // Update the gradient opacity based on scroll position
            const scrollPercentage = currentScroll / maxScroll;
            
            if (scrollPercentage > 0.9) {
                // Near the end, fade out right indicator
                document.querySelector('.carousel::after')?.style.opacity = '0';
            } else {
                document.querySelector('.carousel::after')?.style.opacity = '1';
            }
        });
    }
});