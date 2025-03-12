document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeNavBtn = document.getElementById('closeNavBtn');
    const sideNav = document.getElementById('sideNav');
    const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
    const htmlElement = document.documentElement;
    const mobileMenuOverlay = document.createElement('div');
    
    // Calculate scrollbar width to prevent page jump
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    
    // Add overlay
    mobileMenuOverlay.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-30', 'hidden', 'lg:hidden');
    mobileMenuOverlay.id = 'mobileMenuOverlay';
    document.body.appendChild(mobileMenuOverlay);
    
    // Functions
    function openMenu() {
        sideNav.classList.remove('-translate-x-full');
        mobileMenuOverlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); 
        htmlElement.classList.add('mobile-menu-open');
    }
    
    function closeMenu() {
        sideNav.classList.add('-translate-x-full');
        mobileMenuOverlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        htmlElement.classList.remove('mobile-menu-open');
    }
    
    // Event listeners
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMenu);
    if (closeNavBtn) closeNavBtn.addEventListener('click', closeMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);
    
    // Close when nav links are clicked (on mobile)
    const navLinks = sideNav.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 1024) {
                closeMenu();
            }
        });
    });
    
    // Mobile dark mode toggle
    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', function() {
            htmlElement.classList.toggle('dark');
            const isDarkModeNow = htmlElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDarkModeNow);
        });
    }
    
    // Touch swipe handling
    let touchStartX = 0;
    let touchEndX = 0;
    
    sideNav.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    sideNav.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50 && window.innerWidth < 1024) {
            closeMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            closeMenu();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth < 1024) {
            closeMenu();
        }
    });
});