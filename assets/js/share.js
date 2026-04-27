document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-copy-link]');
    if (!buttons.length || !navigator.clipboard) return;

    buttons.forEach(function (btn) {
        var feedback = btn.querySelector('.bml-share__feedback');
        btn.addEventListener('click', function () {
            var url = btn.getAttribute('data-copy-link');
            if (!url) return;
            navigator.clipboard.writeText(url).then(function () {
                btn.classList.add('is-copied');
                if (feedback) feedback.textContent = 'Copied!';
                setTimeout(function () {
                    btn.classList.remove('is-copied');
                    if (feedback) feedback.textContent = '';
                }, 1500);
            }).catch(function () { /* silent */ });
        });
    });
});
