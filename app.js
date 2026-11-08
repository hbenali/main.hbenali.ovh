(function () {
    'use strict';

    var $ = function (id) { return document.getElementById(id); };

    // ── Active section in the top bar ──
    var links = Array.prototype.slice.call(document.querySelectorAll('.bar nav a'));
    var targets = links.map(function (a) { return $(a.getAttribute('href').slice(1)); });
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                links.forEach(function (a) {
                    a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id));
                });
            });
        }, { rootMargin: '-35% 0px -60% 0px' });
        targets.forEach(function (t) { if (t) io.observe(t); });
    }

    // ── Tool filter ──
    var filterInput = $('toolFilter');
    var toolCount = $('toolCount');
    var toolEmpty = $('toolEmpty');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-tool]'));
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
        toolCount.textContent = terms.length ? shown + ' of ' + cards.length + ' tools' : cards.length + ' tools';
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
    var copyBtn = $('copyBtn');
    var copyLabel = $('copyLabel');
    copyBtn.addEventListener('click', function () {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText('contact@hbenali.ovh').then(function () {
            copyLabel.textContent = 'Copied';
            setTimeout(function () { copyLabel.textContent = 'Copy address'; }, 2200);
        }, function () { /* clipboard unavailable: the mailto link still works */ });
    });
})();
