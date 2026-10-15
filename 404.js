(function () {
    'use strict';
    var root = document.documentElement;
    var toggle = document.querySelector('.theme-toggle');
    var use = toggle.querySelector('use');

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
        use.setAttribute('href', '/icons.svg#' + (theme === 'dark' ? 'i-sun' : 'i-moon'));
        toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    toggle.addEventListener('click', function () {
        setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    var path = decodeURIComponent(window.location.pathname) || '/';
    document.getElementById('reqPath').textContent = path;
    document.getElementById('reqPathEcho').textContent = path;
})();
