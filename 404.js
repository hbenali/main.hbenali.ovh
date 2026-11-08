(function () {
    'use strict';
    // Show the address that failed.
    var path = decodeURIComponent(window.location.pathname) || '/';
    document.getElementById('reqPath').textContent = path;
})();
