// Enhanced carousel experience with drag-to-scroll for desktop
document.addEventListener('DOMContentLoaded', function() {
    const carouselWrappers = document.querySelectorAll('.carousel-wrapper');
    const carouselHint = document.querySelector('.carousel-nav-hint');

    // Mobile hint functionality
    if (carouselHint && window.innerWidth <= 768 && !localStorage.getItem('carouselHintSeen')) {
        carouselHint.classList.remove('hidden');
        carouselHint.classList.add('flex');

        setTimeout(() => {
            localStorage.setItem('carouselHintSeen', 'true');
            carouselHint.style.transition = 'opacity 0.5s ease-out';
            carouselHint.style.opacity = '0';

            setTimeout(() => {
                carouselHint.classList.add('hidden');
            }, 500);
        }, 5000);
    }

    // Drag-to-scroll for all carousels
    carouselWrappers.forEach(carousel => {
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            // Ignore if clicking on a link
            if (e.target.closest('a')) return;

            isDown = true;
            carousel.classList.add('cursor-grabbing');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('cursor-grabbing');
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('cursor-grabbing');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            carousel.scrollLeft = scrollLeft - walk;
        });

        // Add grab cursor style
        carousel.style.cursor = 'grab';

        // Make sure scroll is smooth on touch devices
        if ('ontouchstart' in window) {
            carousel.style.webkitOverflowScrolling = 'touch';
        }
    });
});
