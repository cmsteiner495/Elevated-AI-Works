// EAW v2 - main.js
// Purpose: shared UI glue (mobile nav, header state, hero background)

(function () {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  let navIsOpen = false;

  function initMobileNav() {
    const btn = document.getElementById('navToggle');
    const menu = document.getElementById('mobileNav');
    const header = document.querySelector('.site-header');
    if (!btn || !menu || !header) return () => false;

    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    header.appendChild(overlay);

    function setNavState(open) {
      navIsOpen = open;
      menu.classList.toggle('open', open);
      overlay.classList.toggle('is-visible', open);
      btn.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    }

    // Initialize in a known closed state for accessibility tools
    setNavState(false);

    const toggleNav = () => setNavState(!menu.classList.contains('open'));

    btn.addEventListener('click', () => toggleNav());
    overlay.addEventListener('click', () => setNavState(false));

    menu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        setNavState(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        setNavState(false);
        btn.focus({ preventScroll: true });
      }
    });

    return () => navIsOpen;
  }

  function initHeaderState(getNavOpen) {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    const hideOffset = 140; // waits before hiding to keep behavior stable
    const scrollBuffer = 8; // prevents jitter from tiny scroll changes

    function syncHeader() {
      const y = window.scrollY;
      const atTop = y <= 2;
      const scrollingDown = y > lastScrollY + scrollBuffer;

      header.classList.toggle('is-scrolled', !atTop);

      const navOpen = typeof getNavOpen === 'function' ? getNavOpen() : false;
      if (navOpen) {
        header.classList.remove('is-hidden');
        lastScrollY = y;
        return;
      }

      if (scrollingDown && y > hideOffset) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }

      lastScrollY = y;
    }

    syncHeader();
    window.addEventListener('scroll', () => requestAnimationFrame(syncHeader), { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const navStateGetter = initMobileNav();
    initHeaderState(navStateGetter);
  });
})();
