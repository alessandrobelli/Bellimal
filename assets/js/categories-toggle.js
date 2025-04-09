document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleCategoriesBtn');
    const categoriesList = document.getElementById('categoriesList');
    const chevronIcon = toggleBtn.querySelector('svg:last-child');
    
    // Initialize as closed
    let isOpen = false;
    
    toggleBtn.addEventListener('click', function() {
        isOpen = !isOpen;
        
        if (isOpen) {
            // Calculate proper height for the content
            categoriesList.style.maxHeight = categoriesList.scrollHeight + 'px';
            chevronIcon.classList.add('rotate-180');
            
            // Animate tags appearing with a staggered delay
            const tags = categoriesList.querySelectorAll('.category-tag');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0)';
                }, 50 + (index * 30));
            });
        } else {
            categoriesList.style.maxHeight = '0';
            chevronIcon.classList.remove('rotate-180');
            
            // Reset animations when closing
            const tags = categoriesList.querySelectorAll('.category-tag');
            tags.forEach(tag => {
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(10px)';
            });
        }
    });
    
    // Handle window resize to adjust the height if open
    window.addEventListener('resize', function() {
        if (isOpen) {
            categoriesList.style.maxHeight = categoriesList.scrollHeight + 'px';
        }
    });
    
    // Add hover effects to category tags
    const categoryTags = document.querySelectorAll('.category-tag');
    categoryTags.forEach(tag => {
        // Set initial state as hidden
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px)';
        
        // Add subtle hover animation
        tag.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
});