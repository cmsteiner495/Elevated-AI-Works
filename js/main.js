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

    // Root cause: dropdown felt detached because it was absolutely positioned to the viewport.
    // Anchor it to the toggle button so it always opens from the same side.
    const syncMenuPosition = () => {
      const btnRect = btn.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const left = btnRect.left - headerRect.left;
      const top = btnRect.bottom - headerRect.top + 8;

      menu.style.setProperty('--mobile-nav-left', `${left}px`);
      menu.style.setProperty('--mobile-nav-right', 'auto');
      menu.style.setProperty('--mobile-nav-top', `${top}px`);
      menu.style.setProperty('--mobile-nav-min-width', `${Math.max(btnRect.width, 240)}px`);
    };

    function setNavState(open) {
      navIsOpen = open;
      document.body.classList.toggle('nav-open', open);
      menu.classList.toggle('open', open);
      overlay.classList.toggle('is-visible', open);
      btn.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));

      if (open) syncMenuPosition();
    }

    // Initialize in a known closed state for accessibility tools
    setNavState(false);

    const toggleNav = () => setNavState(!document.body.classList.contains('nav-open'));

    btn.addEventListener('click', () => toggleNav());
    overlay.addEventListener('click', () => setNavState(false));

    document.addEventListener('pointerdown', (event) => {
      if (!document.body.classList.contains('nav-open')) return;
      const target = event.target;
      if (menu.contains(target) || btn.contains(target)) return;
      setNavState(false);
    });

    menu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        setNavState(false);
      }
    });

    window.addEventListener('resize', () => { if (menu.classList.contains('open')) syncMenuPosition(); }, { passive: true });

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
    initPortfolioCarousels();
  });

  function initPortfolioCarousels() {
    const portfolioCarousels = [
      {
        id: 'carousel-twh',
        projectName: 'True West Handyman',
        // Per brief mapping: img/portfolio/project2 contains the True West Handyman assets.
        images: [
          'img/portfolio/project2/placeholder6.png',
          'img/portfolio/project2/placeholder7.png',
          'img/portfolio/project2/placeholder8.png',
          'img/portfolio/project2/placeholder9.png',
          'img/portfolio/project2/placeholder10.png'
        ]
      },
      {
        id: 'carousel-pwc',
        projectName: 'Paws & Whiskers Care',
        // Per brief mapping: img/portfolio/project1 assets are for Paws & Whiskers Care.
        images: [
          'img/portfolio/project1/placeholder1.png',
          'img/portfolio/project1/placeholder2.png',
          'img/portfolio/project1/placeholder3.png',
          'img/portfolio/project1/placeholder4.png',
          'img/portfolio/project1/placeholder5.png'
        ]
      }
    ];

    portfolioCarousels.forEach((config) => setupCarousel(config));
  }

  function setupCarousel(config) {
    const container = document.getElementById(config.id);
    if (!container) return;

    const stage = container.querySelector('[data-carousel-stage]');
    if (!stage) return;

    const dots = container.querySelector('[data-carousel-dots]');
    const prev = container.querySelector('[data-carousel-prev]');
    const next = container.querySelector('[data-carousel-next]');
    const reduceMotion = prefersReduce.matches;
    let timer = null;
    let currentIndex = 0;

    if (reduceMotion) container.classList.add('reduce-motion');

    const slides = config.images.map((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${config.projectName} website preview ${index + 1}`;
      img.loading = 'lazy';
      img.className = 'carousel-image';

      img.addEventListener('error', () => {
        img.dataset.failed = 'true';
        img.classList.remove('is-active');
        buildDots();
        const available = getAvailableSlides();
        if (available.length) showSlide(Math.min(currentIndex, available.length - 1));
      });

      stage.appendChild(img);
      return img;
    });

    const getAvailableSlides = () => slides.filter((slide) => !slide.dataset.failed);

    const buildDots = () => {
      if (!dots) return;

      const available = getAvailableSlides();
      dots.innerHTML = '';

      const showControls = available.length > 1;
      dots.classList.toggle('is-hidden', !showControls);
      if (prev) prev.hidden = !showControls;
      if (next) next.hidden = !showControls;

      if (!showControls) return;

      available.forEach((slide, dotIndex) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `${config.projectName} slide ${dotIndex + 1}`);
        dot.addEventListener('click', () => {
          stopAutoplay();
          showSlide(dotIndex);
          startAutoplay();
        });
        dots.appendChild(dot);
      });
    };

    const showSlide = (index) => {
      const available = getAvailableSlides();
      if (!available.length) return;

      const safeIndex = ((index % available.length) + available.length) % available.length;

      available.forEach((slide) => slide.classList.remove('is-active'));
      const target = available[safeIndex];
      target.classList.add('is-active');

      if (dots && dots.children.length === available.length) {
        Array.from(dots.children).forEach((dot, dotIndex) => {
          const isActive = dotIndex === safeIndex;
          dot.classList.toggle('is-active', isActive);
          dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      }

      currentIndex = safeIndex;
    };

    const startAutoplay = () => {
      if (reduceMotion) return;
      const available = getAvailableSlides();
      if (available.length <= 1) return;

      stopAutoplay();
      timer = window.setInterval(() => {
        const activeSlides = getAvailableSlides();
        if (activeSlides.length <= 1) return;
        showSlide(currentIndex + 1);
      }, 4200);
    };

    const stopAutoplay = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    buildDots();
    showSlide(0);
    startAutoplay();

    if (prev) {
      prev.addEventListener('click', () => {
        stopAutoplay();
        showSlide(currentIndex - 1);
        startAutoplay();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        stopAutoplay();
        showSlide(currentIndex + 1);
        startAutoplay();
      });
    }

    container.addEventListener('pointerenter', () => stopAutoplay());
    container.addEventListener('pointerleave', () => startAutoplay());
    container.addEventListener('focusin', () => stopAutoplay());
    container.addEventListener('focusout', () => {
      if (!container.contains(document.activeElement)) startAutoplay();
    });

    prefersReduce.addEventListener('change', (event) => {
      const reduce = event.matches;
      container.classList.toggle('reduce-motion', reduce);
      if (reduce) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }
})();
