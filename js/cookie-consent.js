(function () {
  const CONSENT_KEY = 'eaw_cookie_consent';
  const CONSENT_TS_KEY = 'eaw_cookie_consent_ts';
  const GA_ID = 'G-HLV32W95T0';
  const BANNER_ID = 'eaw-cookie-banner';
  const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180; // ~180 days

  function storageAvailable() {
    try {
      const test = '__eaw_cookie_test__';
      localStorage.setItem(test, '1');
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  const canStore = storageAvailable();

  function getStoredConsent() {
    if (!canStore) return { value: null, ts: null };
    const value = localStorage.getItem(CONSENT_KEY);
    const ts = localStorage.getItem(CONSENT_TS_KEY);

    if (ts) {
      const age = Date.now() - Date.parse(ts);
      if (Number.isFinite(age) && age > MAX_AGE_MS) {
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(CONSENT_TS_KEY);
        return { value: null, ts: null };
      }
    }

    return { value, ts };
  }

  function persistConsent(value) {
    if (!canStore) return;
    localStorage.setItem(CONSENT_KEY, value);
    localStorage.setItem(CONSENT_TS_KEY, new Date().toISOString());
  }

  function injectStyles() {
    if (document.querySelector('link[data-cookie-consent-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/cookie-consent.css';
    link.setAttribute('data-cookie-consent-style', 'true');
    document.head.appendChild(link);
  }

  function loadAnalytics() {
    if (window.__eawAnalyticsLoaded) return;
    window.__eawAnalyticsLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_ID);
    };
    document.head.appendChild(script);
  }

  function removeBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (banner) banner.remove();
    document.body.classList.remove('cookie-banner-visible');
  }

  function handleChoice(choice) {
    persistConsent(choice);
    if (choice === 'accepted') {
      loadAnalytics();
    }
    removeBanner();
  }

  function renderBanner() {
    if (document.getElementById(BANNER_ID)) return;
    injectStyles();

    const banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML = `
      <div class="cookie-copy">
        <h3>We use cookies</h3>
        <p>
          We use cookies to improve your experience and understand site traffic (analytics).
          You can accept or decline non-essential cookies. Read our
          <a href="/legal/privacy-policy.html">Privacy Policy</a> for details.
        </p>
      </div>
      <div class="cookie-actions">
        <button class="cookie-btn secondary" type="button" data-consent="declined">Decline</button>
        <button class="cookie-btn primary" type="button" data-consent="accepted">Accept</button>
      </div>
    `;

    banner.addEventListener('click', function (event) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const value = target.getAttribute('data-consent');
      if (value === 'accepted' || value === 'declined') {
        handleChoice(value);
      }
    });

    document.body.appendChild(banner);
    document.body.classList.add('cookie-banner-visible');
  }

  function addFooterSettingsLink() {
    const footerLinks = document.querySelector('.site-footer .footer-links');
    if (!footerLinks || footerLinks.querySelector('[data-cookie-settings]')) return;

    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'cookie-settings-trigger';
    link.setAttribute('data-cookie-settings', 'true');
    link.textContent = 'Cookie settings';
    link.addEventListener('click', function () {
      renderBanner();
    });

    const wrapper = document.createElement('div');
    wrapper.appendChild(link);
    footerLinks.appendChild(wrapper);
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    addFooterSettingsLink();

    const { value } = getStoredConsent();
    if (value === 'accepted') {
      loadAnalytics();
      return;
    }

    if (value === 'declined') return;
    renderBanner();
  });

  window.EAWCookieConsent = {
    open: renderBanner,
    status: getStoredConsent,
  };
})();
