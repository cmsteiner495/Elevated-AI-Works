// EAW Interaction Language v1 — motion + interaction scaffolding
// - Add data-reveal to any element you want to fade + rise on entry
// - Add data-stagger to a parent to stagger its direct children (100ms step)
// - Add data-nav-link to navigation links to opt into crossfade transitions
// - Add data-transition-container to the main content wrapper
(function () {
  document.documentElement.classList.add('js-enabled');

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function msFromVar(token, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    if (!raw) return fallback;
    const parsed = parseFloat(raw.replace('ms', ''));
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  const MOTION = {
    base: msFromVar('--motion-base', 240),
    slow: msFromVar('--motion-slow', 400)
  };

  function prepareStagger(el) {
    const children = el.querySelectorAll(':scope > *');
    const step = 100; // within the 80–120ms guidance
    children.forEach((child, index) => {
      child.style.transitionDelay = `${prefersReduce ? 0 : index * step}ms`;
    });
  }

  function revealOnIntersect() {
    const revealables = document.querySelectorAll('[data-reveal]');
    if (!revealables.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            if (target.dataset.stagger !== undefined) {
              prepareStagger(target);
            }
            target.classList.add('is-revealed');
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    revealables.forEach((el) => {
      // Root cause: portfolio sections were briefly revealed then hidden because the observer fired too late; ensure visible if already in view.
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
      if (inView) {
        if (el.dataset.stagger !== undefined) {
          prepareStagger(el);
        }
        el.classList.add('is-revealed');
        return;
      }

      if (prefersReduce) {
        if (el.dataset.stagger !== undefined) {
          prepareStagger(el);
        }
        el.classList.add('is-revealed');
        return;
      }
      observer.observe(el);
    });
  }

  function initPageTransitions() {
    const container = document.querySelector('[data-transition-container]');
    if (!container) return;

    const navLinks = document.querySelectorAll('[data-nav-link]');

    const enterContent = () => {
      container.classList.remove('is-preparing');
      container.classList.add('is-entering');
      setTimeout(() => container.classList.remove('is-entering'), MOTION.slow);
    };

    container.classList.add('is-preparing');
    requestAnimationFrame(enterContent);

    const shouldBypass = (event, link) => {
      const href = link.getAttribute('href');
      return (
        !href ||
        href.startsWith('#') ||
        link.target === '_blank' ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      );
    };

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        if (prefersReduce || shouldBypass(event, link)) return;
        const href = link.getAttribute('href');
        if (!href) return;
        event.preventDefault();
        container.classList.add('is-exiting');
        setTimeout(() => {
          window.location.href = href;
        }, MOTION.base);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    revealOnIntersect();
    initPageTransitions();
  });
})();
