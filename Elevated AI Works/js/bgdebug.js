// EAW v2 - background debug helper
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get('bgdebug') === '1') {
    document.documentElement.classList.add('bgdebug');
    if (document.body) document.body.classList.add('bgdebug');
  }
})();
