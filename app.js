(function () {
    'use strict';

    var root = document.documentElement;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function (id) { return document.getElementById(id); };

    // ── Theme ──
    var themeToggle = document.querySelector('.theme-toggle');
    var themeUse = themeToggle.querySelector('use');

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
        // Icon shows the theme you would switch to
        themeUse.setAttribute('href', 'icons.svg#' + (theme === 'dark' ? 'i-sun' : 'i-moon'));
        themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    themeToggle.addEventListener('click', function () {
        setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    // ── Window controls ──
    var terminalWindow = document.querySelector('.terminal-window');
    var respawnMsg = $('respawnMsg');

    function pop() {
        terminalWindow.classList.remove('wm-pop');
        void terminalWindow.offsetWidth;
        terminalWindow.classList.add('wm-pop');
    }

    $('winMinimize').addEventListener('click', function () {
        terminalWindow.classList.remove('wm-maximized');
        terminalWindow.classList.toggle('wm-minimized');
    });

    $('winMaximize').addEventListener('click', function () {
        terminalWindow.classList.remove('wm-minimized');
        terminalWindow.classList.toggle('wm-maximized');
        pop();
    });

    $('winClose').addEventListener('click', function () {
        if (terminalWindow.classList.contains('wm-closing')) return;
        terminalWindow.classList.remove('wm-maximized', 'wm-minimized');
        terminalWindow.classList.add('wm-closing');
        setTimeout(function () { respawnMsg.classList.add('show'); }, 350);
        setTimeout(function () {
            respawnMsg.classList.remove('show');
            terminalWindow.classList.remove('wm-closing');
            pop();
        }, 950);
    });

    // ── Scroll progress ──
    var scrollProgress = $('scrollProgress');
    window.addEventListener('scroll', function () {
        var h = document.documentElement;
        var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
        scrollProgress.style.width = (isFinite(pct) ? pct : 0) + '%';
    }, { passive: true });

    // ── Role typewriter ──
    var roles = ['IT Consultant', 'Software Factory Engineer', 'Cloud Engineer', 'SRE', 'Automation Enthusiast'];
    var roleEl = $('roleTyped');
    var roleIdx = 0;

    function typeRole(text, cb) {
        roleEl.textContent = '';
        var i = 0;
        var iv = setInterval(function () {
            roleEl.textContent = text.slice(0, ++i);
            if (i === text.length) { clearInterval(iv); setTimeout(cb, 1600); }
        }, 45);
    }

    function eraseRole(cb) {
        var text = roleEl.textContent;
        var i = text.length;
        var iv = setInterval(function () {
            roleEl.textContent = text.slice(0, --i);
            if (i === 0) { clearInterval(iv); cb(); }
        }, 25);
    }

    function cycleRoles() {
        typeRole(roles[roleIdx], function () {
            eraseRole(function () {
                roleIdx = (roleIdx + 1) % roles.length;
                cycleRoles();
            });
        });
    }

    if (reducedMotion) roleEl.textContent = roles[0]; else cycleRoles();

    // ── Tool card spotlight ──
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-tool]'));
    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
            card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
        });
    });

    // ── Tool filter ──
    var filterInput = $('toolFilter');
    var toolCount = $('toolCount');
    var toolEmpty = $('toolEmpty');
    var groups = Array.prototype.slice.call(document.querySelectorAll('.tool-group'));

    // Searchable text per card, computed once
    var haystack = cards.map(function (c) { return c.textContent.toLowerCase().replace(/\s+/g, ' '); });

    function applyFilter() {
        var terms = filterInput.value.toLowerCase().split(/\s+/).filter(Boolean);
        var shown = 0;
        cards.forEach(function (card, i) {
            var match = terms.every(function (t) { return haystack[i].indexOf(t) !== -1; });
            card.hidden = !match;
            if (match) shown++;
        });
        groups.forEach(function (g) {
            g.hidden = !g.querySelector('[data-tool]:not([hidden])');
        });
        toolEmpty.hidden = shown !== 0;
        toolCount.textContent = terms.length ? shown + ' / ' + cards.length + ' tools' : cards.length + ' tools';
    }

    filterInput.addEventListener('input', applyFilter);
    filterInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { filterInput.value = ''; applyFilter(); filterInput.blur(); }
        if (e.key === 'Enter') {
            var first = document.querySelector('[data-tool]:not([hidden])');
            if (first && filterInput.value.trim()) first.click();
        }
    });

    // "/" focuses the filter (unless typing somewhere already)
    document.addEventListener('keydown', function (e) {
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
        var t = e.target;
        if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        e.preventDefault();
        filterInput.focus();
        filterInput.select();
    });

    applyFilter();

    // ── Copy email ──
    var emailLink = $('emailLink');
    var copyHint = $('copyHint');
    emailLink.addEventListener('click', function () {
        if (navigator.clipboard) {
            navigator.clipboard.writeText('contact@hbenali.ovh').then(function () {
                copyHint.classList.add('show');
                setTimeout(function () { copyHint.classList.remove('show'); }, 2000);
            });
        }
    });
})();
