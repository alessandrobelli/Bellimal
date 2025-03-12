// Add subtle animations to elements
document.addEventListener('DOMContentLoaded', function() {
    // Add staggered entrance for posts
    const posts = document.querySelectorAll('.post-card');
    posts.forEach((post, index) => {
        post.classList.add('stagger-item');
        setTimeout(() => {
            post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, 100 + (index * 100)); // Stagger by 100ms per item
    });
    
    // Add dancing star animation to title stars
    const stars = document.querySelectorAll('.star-emoji');
    stars.forEach((star) => {
        star.classList.add('dancing-star');
    });
    
    // Add shimmer effect to GitHub link
    const githubLink = document.querySelector('.github-link');
    if (githubLink) {
        githubLink.classList.add('shimmer-link');
    }
    
    // Add animation to tags
    const tags = document.querySelectorAll('.post-card-primary-tag');
    tags.forEach((tag) => {
        // Subtle pulse on hover
        tag.addEventListener('mouseenter', function() {
            this.classList.add('scale-105');
        });
        tag.addEventListener('mouseleave', function() {
            this.classList.remove('scale-105');
        });
    });
    
    // Add intersection observer for fade-in elements
    const fadeElements = document.querySelectorAll('.should-fade');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-text');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});
