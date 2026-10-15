// Runs before first paint (blocking, in <head>) so there is no theme flash.
(function () {
    var root = document.documentElement;
    var theme = 'dark';
    var seen = false;
    try {
        theme = localStorage.getItem('theme') || 'dark';
        seen = !!localStorage.getItem('visited');
        localStorage.setItem('visited', '1');
    } catch (e) { /* storage blocked: defaults */ }
    root.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Typing animation on the prompt only for first-time visitors
    if (!seen && !reduced) root.classList.add('anim');
})();
