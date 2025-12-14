// EAW v2 - main.js
// Purpose: shared UI glue (mobile nav, header state, hero background)

(function () {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Durations stay inside the required 4–8s fade + 6–12s hold windows
  const HERO_FADE_MS = 6000; // calm crossfade per EAW-IL v1 guidance
  const HERO_HOLD_MS = 9000; // keep frame stable before the next fade

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
      document.body.classList.toggle('nav-open', open);
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

  function initHeroBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Keep fade timing in sync with CSS via a token so adjustments stay within spec
    document.documentElement.style.setProperty('--hero-fade-duration', `${HERO_FADE_MS}ms`);

    const variants = [
      { src: 'img/backgrounds/mountains-premium.png', filter: 'saturate(1.05) contrast(1.02)' },
      { src: 'img/backgrounds/mountains-premium.png', filter: 'saturate(0.96) brightness(1.04)' },
      { src: 'img/backgrounds/mountains-premium.png', filter: 'saturate(1.1) hue-rotate(-4deg)' }
    ];

    const bg = document.createElement('div');
    bg.className = 'hero-bg';
    bg.setAttribute('aria-hidden', 'true');
    hero.prepend(bg);

    const layers = variants.map((variant, index) => {
      const img = document.createElement('img');
      img.className = 'hero-bg-layer';
      img.alt = '';
      img.decoding = 'async';
      img.loading = index === 0 ? 'eager' : 'lazy';
      if (variant.filter) {
        img.style.setProperty('--hero-filter', variant.filter);
      }

      if (index === 0) {
        // Preload the first frame immediately to avoid a blank hero
        img.src = variant.src;
      }

      bg.appendChild(img);
      return img;
    });

    if (prefersReduce.matches) {
      // Reduced motion: lock to the first static image and skip timers
      if (!layers[0].src) layers[0].src = variants[0].src;
      layers[0].classList.add('is-active');
      return;
    }

    let activeIndex = 0;
    layers[0].classList.add('is-active');

    function ensureLoaded(index) {
      const layer = layers[index];
      if (layer && !layer.src) {
        layer.src = variants[index].src;
      }
    }

    function cycleBackground() {
      const nextIndex = (activeIndex + 1) % layers.length;
      ensureLoaded(nextIndex);

      layers[activeIndex].classList.remove('is-active');
      layers[nextIndex].classList.add('is-active');
      activeIndex = nextIndex;
    }

    // Fade duration lives in CSS; timer handles the hold window only
    setInterval(cycleBackground, HERO_HOLD_MS);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const navStateGetter = initMobileNav();
    initHeaderState(navStateGetter);
    initHeroBackground();
  });
})();
