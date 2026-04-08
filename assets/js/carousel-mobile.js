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
        let isDragging = false;
        let hasDragged = false;
        let startX;
        let scrollLeft;
        const DRAG_THRESHOLD = 5;

        function startDrag(e) {
            isDragging = true;
            hasDragged = false;
            carousel.classList.add('dragging');
            startX = e.clientX;
            scrollLeft = carousel.scrollLeft;
        }

        function onDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.clientX;
            const walk = (x - startX) * 1.5;

            if (Math.abs(x - startX) > DRAG_THRESHOLD) {
                hasDragged = true;
            }

            requestAnimationFrame(() => {
                carousel.scrollLeft = scrollLeft - walk;
            });
        }

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            carousel.classList.remove('dragging');
        }

        // Mouse events
        carousel.addEventListener('mousedown', startDrag);
        carousel.addEventListener('mousemove', onDrag);
        carousel.addEventListener('mouseup', endDrag);
        carousel.addEventListener('mouseleave', endDrag);

        // Prevent link navigation when dragging
        carousel.addEventListener('click', (e) => {
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
                hasDragged = false;
            }
        }, true);

        // Prevent native image/link dragging inside carousel
        carousel.querySelectorAll('a, img').forEach(el => {
            el.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Touch: let native scroll-snap handle it
        if ('ontouchstart' in window) {
            carousel.style.webkitOverflowScrolling = 'touch';
        }
    });
});
