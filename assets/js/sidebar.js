document.addEventListener('DOMContentLoaded', function () {
    var topicsToggle = document.querySelector('.bml-sidebar__topics-toggle');
    var topicsBody = document.getElementById('bml-topics-list');

    if (topicsToggle && topicsBody) {
        topicsBody.hidden = true;
        topicsToggle.setAttribute('aria-expanded', 'false');
        topicsToggle.addEventListener('click', function () {
            var next = topicsToggle.getAttribute('aria-expanded') !== 'true';
            topicsToggle.setAttribute('aria-expanded', String(next));
            topicsBody.hidden = !next;
        });
    }

    var chipsList = document.querySelector('.bml-sidebar__chips');
    var showMore = document.querySelector('[data-show-more]');
    var showMoreLabel = document.querySelector('[data-show-more-label]');
    if (chipsList && showMore && showMoreLabel) {
        var count = chipsList.querySelectorAll('li').length;
        if (count <= 8) {
            showMore.hidden = true;
        } else {
            showMore.addEventListener('click', function () {
                var next = showMore.getAttribute('aria-expanded') !== 'true';
                showMore.setAttribute('aria-expanded', String(next));
                chipsList.classList.toggle('is-expanded', next);
                showMoreLabel.textContent = next ? 'show less' : 'show more';
            });
        }
    }
});
