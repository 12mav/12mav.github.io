(() => {
  'use strict';

  const SITE = '12MAV';
  const FOUNDED = 2025; // не используется для копирайта — оставлено, если нужно где-то ещё

  const DICT = {
    en: { nav: { home: '12MAV', contact: 'Contact', privacy: 'Privacy', terms: 'Terms' } }
  };

  const NAV_SCROLL_KEY = 'nav:scrollLeft';

  const $all = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const norm = (p) => {
    if (!p) return '/';
    p = p.replace(/index\.html$/i, '');
    if (p !== '/' && !p.endsWith('/')) p += '/';
    return p;
  };

  function setupNav() {
    const current = norm(location.pathname);
    $all('.nav a').forEach(a => {
      const url = new URL(a.getAttribute('href'), location.origin);
      const target = norm(url.pathname);
      const active = (target === current);
      if (active) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
      // перед переходом сохраняем текущую позицию скролла меню
      a.addEventListener('click', () => saveNavScroll(), { passive: true });
      // клик по текущей странице — скролл вверх (поведение без изменений)
      a.addEventListener('click', (e) => {
        if (norm(url.pathname) === current) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  function i18nInit() {
    const lang = ((navigator.language || 'en') + '').toLowerCase().split('-')[0];
    const dict = DICT[DICT[lang] ? lang : 'en'];
    $all('[data-i18n]').forEach(node => {
      const path = node.getAttribute('data-i18n');
      if (!path) return;
      const val = path.split('.').reduce((acc, k) => acc && acc[k], dict);
      if (typeof val === 'string') node.textContent = val;
    });
  }

  function saveNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    sessionStorage.setItem(NAV_SCROLL_KEY, String(nav.scrollLeft || 0));
  }

  function restoreNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const saved = sessionStorage.getItem(NAV_SCROLL_KEY);
    if (saved == null) return;
    const max = Math.max(0, nav.scrollWidth - nav.clientWidth);
    const val = Math.max(0, Math.min(parseFloat(saved) || 0, max));
    nav.scrollLeft = val;
  }

  function init() {
    i18nInit();
    setupNav();
    restoreNavScroll();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => restoreNavScroll());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // сохраняем позицию на уход со страницы (подстраховка)
  window.addEventListener('beforeunload', saveNavScroll);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveNavScroll();
  });

  // bfcache: браузер сам восстановит позицию; ничего дополнительно не делаем
})();
