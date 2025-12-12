// EAW v2 - main.js
// Purpose: shared UI glue (mobile nav)

(function () {
  function initMobileNav() {
    const btn = document.getElementById('navToggle');
    const menu = document.getElementById('mobileNav');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking a link (mobile UX)
    menu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
  });
})();
