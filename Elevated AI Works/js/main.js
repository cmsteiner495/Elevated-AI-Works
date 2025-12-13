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

  function initRevealAnimations() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = Array.from(
      document.querySelectorAll('section, .hero-panel, .card, .tile, .work-card, .cta-block')
    );

    if (!nodes.length) return;

    nodes.forEach((node, index) => {
      node.classList.add('reveal');
      if (!reduceMotion.matches) {
        node.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
      } else {
        node.classList.add('is-visible');
      }
    });

    if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initRevealAnimations();
  });
})();
