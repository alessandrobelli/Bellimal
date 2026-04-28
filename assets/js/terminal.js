/**
 * Bellimal interactive terminal — progressive enhancement on top of the faux
 * terminal rendered by home.hbs. Loads only on the home route. Reads server-
 * rendered data from a hidden DOM block so we never have to escape strings
 * into JS literals. No deps, no framework.
 */
(function () {
    'use strict';

    var root = document.querySelector('[data-terminal-root]');
    if (!root) return;

    var output = root.querySelector('[data-terminal-output]');
    var inputLine = root.querySelector('[data-terminal-input-line]');
    var hintBtn = root.querySelector('[data-terminal-hint]');
    if (!output || !inputLine) return;

    // ── Read server-rendered data ─────────────────────────────────────────
    function readText(key) {
        var el = document.querySelector('[data-bml="' + key + '"]');
        return el ? (el.textContent || '').trim() : '';
    }
    function readList(key, fields) {
        var ul = document.querySelector('[data-bml="' + key + '"]');
        if (!ul) return [];
        return Array.prototype.map.call(ul.querySelectorAll('li'), function (li) {
            var item = {};
            fields.forEach(function (f) { item[f] = li.dataset[f] || ''; });
            return item;
        });
    }

    var heroTitle = readText('hero-title');
    var heroDescription = readText('hero-description');
    var contactEmail = readText('contact');
    var nav = readList('nav', ['label', 'url', 'slug']);
    var tags = readList('tags', ['name', 'slug', 'url', 'count']);
    var posts = readList('posts', ['title', 'slug', 'url', 'date', 'readingTime', 'excerpt']);
    var allPosts = readList('all-posts', ['slug', 'title', 'url']);
    var allPages = readList('all-pages', ['slug', 'title', 'url']);

    // Ghost @site.navigation usually provides a `slug` field directly. If
    // it's missing for any entry (older Ghost / bare URLs), fall back to
    // parsing the last path segment from the url.
    nav.forEach(function (n) {
        if (n.slug) return;
        try {
            var path = new URL(n.url, window.location.origin).pathname.replace(/\/$/, '');
            var parts = path.split('/').filter(Boolean);
            n.slug = parts.length ? parts[parts.length - 1] : '';
        } catch (e) {
            n.slug = (n.url || '').replace(/^\/+|\/+$/g, '').split('/').pop() || '';
        }
    });

    // ── Upgrade: replace the faux content (underscore + cursor block) with
    //    a real input. Native caret blinks when focused; nothing else. ─────
    var fauxContent = inputLine.querySelector('.bml-terminal__cursor-content');
    if (fauxContent) fauxContent.remove();

    var input = document.createElement('input');
    input.type = 'text';
    input.spellcheck = false;
    input.autocomplete = 'off';
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('aria-label', 'Terminal command');
    input.className = 'bml-terminal__input';
    inputLine.appendChild(input);

    // ── History (localStorage, capped at 50) ──────────────────────────────
    var HISTORY_KEY = 'bellimal.terminal.history';
    var MAX_HISTORY = 50;
    var history = (function () {
        try {
            var raw = localStorage.getItem(HISTORY_KEY);
            return raw ? JSON.parse(raw).slice(-MAX_HISTORY) : [];
        } catch (e) { return []; }
    })();
    var historyIdx = -1;

    function saveHistory() {
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY))); }
        catch (e) { /* quota / disabled */ }
    }
    function pushHistory(line) {
        if (!line || history[history.length - 1] === line) return;
        history.push(line);
        if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
        saveHistory();
    }

    // ── Print / scroll helpers ────────────────────────────────────────────
    function printLine(text, opts) {
        opts = opts || {};
        var node;
        if (opts.href) {
            node = document.createElement('a');
            node.href = opts.href;
            node.className = 'bml-terminal__line bml-terminal__line--link';
        } else {
            node = document.createElement('div');
            var cls = 'bml-terminal__line';
            if (opts.cls === 'error') cls += ' bml-terminal__line--error';
            else if (opts.cls === 'echo') cls = 'bml-terminal__prompt';
            node.className = cls;
        }
        node.textContent = text; // user input always escaped via textContent
        output.appendChild(node);
        output.scrollTop = output.scrollHeight;
    }

    // Print an inline space-separated list where each item is a clickable
    // anchor — used by `ls` and `tags`.
    function printInlineLinks(items) {
        if (!items.length) return;
        var line = document.createElement('div');
        line.className = 'bml-terminal__line';
        items.forEach(function (item, i) {
            if (i > 0) line.appendChild(document.createTextNode('  '));
            var a = document.createElement('a');
            a.href = item.href || '/';
            a.className = 'bml-terminal__line--link';
            a.textContent = item.text;
            line.appendChild(a);
        });
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function clean(s) { return (s || '').replace(/^\/+|\/+$/g, ''); }

    function navigate(slugOrCmd) {
        var slug = clean(slugOrCmd);
        if (!slug) { printLine('usage: cd <slug>', { cls: 'error' }); return; }
        var match = nav.find(function (n) { return n.slug === slug; })
                || allPosts.find(function (p) { return p.slug === slug; })
                || allPages.find(function (p) { return p.slug === slug; });
        if (match) {
            printLine('navigating to ' + match.url);
            window.location.href = match.url;
        } else {
            printLine('command not found: ' + slug, { cls: 'error' });
        }
    }

    // ── Commands ──────────────────────────────────────────────────────────
    var commands = {
        help: function () {
            printLine('Available commands:');
            printLine('  help            show this list');
            printLine('  whoami          who runs this site');
            printLine('  ls              list pages');
            printLine('  cd <slug>       navigate to a page');
            printLine('  cat <slug>      open a page');
            printLine('  posts           latest posts');
            printLine('  tags            available tags');
            printLine('  contact         email + clipboard');
            printLine('  clear           clear screen');
            printLine('  theme           toggle light/dark');
        },
        whoami: function () { printLine(heroTitle || 'unknown'); },
        ls: function () {
            if (!nav.length) { printLine('(no pages)'); return; }
            printInlineLinks(nav.map(function (n) {
                return { text: n.slug ? n.slug + '/' : '/', href: n.url || '/' };
            }));
        },
        cd: function (args) { navigate(args[0] || ''); },
        cat: function (args) {
            if (!args[0]) { printLine('usage: cat <slug>', { cls: 'error' }); return; }
            var arg = args[0];
            // Synthetic files shown in the initial faux terminal state
            if (arg === 'focus.txt' || arg === 'focus') {
                printLine(heroDescription || 'focus.txt: empty');
                return;
            }
            var slug = clean(arg);
            // 1) Latest 5 posts have excerpts — render a preview
            var preview = posts.find(function (p) { return p.slug === slug; });
            if (preview) {
                printLine(preview.title);
                if (preview.excerpt) printLine(preview.excerpt);
                printLine('— read more', { href: preview.url });
                return;
            }
            // 2) Any other published post / page — show title + link
            var item = allPosts.find(function (p) { return p.slug === slug; })
                    || allPages.find(function (p) { return p.slug === slug; });
            if (item) {
                printLine(item.title);
                printLine('— open', { href: item.url });
                return;
            }
            // 3) Fall back to nav-aware navigate (errors out if no match)
            navigate(slug);
        },
        posts: function () {
            if (!posts.length) { printLine('(no posts)'); return; }
            posts.forEach(function (p) {
                printLine(p.date + '  ' + p.slug + ' (' + p.readingTime + ')', { href: p.url });
            });
        },
        tags: function () {
            if (!tags.length) { printLine('(no tags)'); return; }
            printInlineLinks(tags.map(function (t) {
                return { text: '#' + t.slug + ' (' + t.count + ')', href: t.url };
            }));
        },
        topics: function () { commands.tags(); },
        contact: function () {
            var email = contactEmail || 'hello@example.com';
            printLine(email);
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email)
                    .then(function () { printLine('(copied to clipboard)'); })
                    .catch(function () { /* silent */ });
            }
        },
        clear: function () {
            while (output.firstChild) output.removeChild(output.firstChild);
        },
        theme: function () {
            var html = document.documentElement;
            html.classList.toggle('dark');
            var isDark = html.classList.contains('dark');
            try { localStorage.setItem('darkMode', String(isDark)); } catch (e) { }
            printLine('theme: ' + (isDark ? 'dark' : 'light'));
        },
        sudo: function () { printLine('permission denied: nice try', { cls: 'error' }); }
    };

    // `?` as an alias for `help` — shell muscle memory.
    commands['?'] = commands.help;

    function execute(line) {
        line = (line || '').trim();
        if (!line) return;
        printLine(line, { cls: 'echo' });
        pushHistory(line);
        var parts = line.split(/\s+/);
        var cmd = parts[0].toLowerCase();
        var args = parts.slice(1);
        if (cmd === 'sudo') { commands.sudo(); return; }
        if (Object.prototype.hasOwnProperty.call(commands, cmd)) {
            commands[cmd](args);
        } else {
            navigate(cmd); // bare slug fallback
        }
    }

    // ── Tab completion (shell-style: complete unique, list multi, silent zero)
    // Position-aware: first word completes commands+slugs; second word of
    // `cat`/`cd` completes against the slug pool.
    function getCompletions(prefix) {
        var spaceIdx = prefix.indexOf(' ');
        var pool, currentPrefix;
        if (spaceIdx === -1) {
            currentPrefix = prefix;
            pool = Object.keys(commands)
                .concat(nav.map(function (n) { return n.slug; }))
                .concat(allPosts.map(function (p) { return p.slug; }))
                .concat(allPages.map(function (p) { return p.slug; }))
                .filter(Boolean);
        } else {
            var cmd = prefix.slice(0, spaceIdx);
            currentPrefix = prefix.slice(spaceIdx + 1);
            if (cmd !== 'cat' && cmd !== 'cd') return [];
            pool = nav.map(function (n) { return n.slug; })
                .concat(allPosts.map(function (p) { return p.slug; }))
                .concat(allPages.map(function (p) { return p.slug; }))
                .filter(Boolean);
        }
        pool = pool.filter(function (v, i, a) { return a.indexOf(v) === i; });
        if (!currentPrefix) return pool;
        return pool.filter(function (c) { return c.indexOf(currentPrefix) === 0; });
    }

    // ── Key handling ──────────────────────────────────────────────────────
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            var line = input.value;
            input.value = '';
            historyIdx = -1;
            execute(line);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!history.length) return;
            historyIdx = Math.min(historyIdx + 1, history.length - 1);
            input.value = history[history.length - 1 - historyIdx];
            setTimeout(function () { input.selectionStart = input.selectionEnd = input.value.length; }, 0);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx <= 0) { historyIdx = -1; input.value = ''; }
            else { historyIdx--; input.value = history[history.length - 1 - historyIdx]; }
        } else if (e.key === 'Tab') {
            // Always intercept Tab inside the terminal: shell-like completion.
            // Esc remains the way out of the input.
            e.preventDefault();
            var raw = input.value;
            var matches = getCompletions(raw);
            if (matches.length === 1) {
                var sp = raw.indexOf(' ');
                input.value = sp === -1 ? matches[0] : (raw.slice(0, sp + 1) + matches[0]);
                setTimeout(function () { input.selectionStart = input.selectionEnd = input.value.length; }, 0);
            } else if (matches.length > 1 && raw) {
                if (matches.length > 30) {
                    printLine(matches.slice(0, 30).join('  ') + '  … (+' + (matches.length - 30) + ' more)');
                } else {
                    printLine(matches.join('  '));
                }
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            input.blur();
        }
    });

    // ── Click anywhere in terminal → focus input (unless selecting / link) ─
    root.addEventListener('click', function (e) {
        if (window.getSelection && String(window.getSelection())) return;
        if (e.target.closest('a')) return;
        if (e.target.closest('[data-terminal-hint]')) return;
        input.focus();
    });

    // ── Hint button → run help ────────────────────────────────────────────
    if (hintBtn) {
        hintBtn.addEventListener('click', function () { execute('help'); input.focus(); });
    }

    // ── Mobile: scroll terminal into view when input gains focus ──────────
    input.addEventListener('focus', function () {
        if (window.innerWidth < 900) {
            setTimeout(function () { root.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 250);
        }
    });

    // ── Auto-focus on desktop so the native caret blinks on page load.
    //    Skip on mobile (would pop the OS keyboard unprompted). Skip if some
    //    other element already has focus. ───────────────────────────────────
    if (window.matchMedia && window.matchMedia('(min-width: 900px)').matches) {
        setTimeout(function () {
            var active = document.activeElement;
            if (!active || active === document.body || active === document.documentElement) {
                try { input.focus({ preventScroll: true }); }
                catch (e) { input.focus(); }
            }
        }, 50);
    }
})();
