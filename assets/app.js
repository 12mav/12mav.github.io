(() => {
  'use strict';

  const SITE = '12MAV';
  const FOUNDED = 2025;

  // i18n-словарь (пока виден только EN; механизм автодетекта есть)
  const DICT = {
    en: {
      nav: { home: '12MAV', contact: 'Contact', privacy: 'Privacy', terms: 'Terms' }
      // В будущем можно добавить: pages/home/contact/privacy/terms, и через data-i18n заменить тексты.
    }
  };

  const $all = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const norm = (p) => {
    if (!p) return '/';
    p = p.replace(/index\.html$/i,'');
    if (p !== '/' && !p.endsWith('/')) p += '/';
    return p;
  };

  function setupNav(){
    const current = norm(location.pathname);
    $all('.nav a').forEach(a => {
      const url = new URL(a.getAttribute('href'), location.origin);
      const target = norm(url.pathname);
      const active = (target === current);
      if (active){
        a.classList.add('active');
        a.setAttribute('aria-current','page');
      }
      a.addEventListener('click', (e) => {
        if (norm(url.pathname) === current){
          e.preventDefault();
          window.scrollTo({top:0, behavior:'smooth'});
        }
      });
    });
  }

  function setupCopyright(){
    const year = new Date().getFullYear();
    const text = (year === FOUNDED) ? `© ${FOUNDED} ${SITE}` : `© ${FOUNDED}-${year} ${SITE}`;
    const el = document.getElementById('copyright');
    if (el) el.textContent = text;
  }

  function i18nInit(){
    const lang = ((navigator.language || 'en')+'').toLowerCase().split('-')[0];
    const dict = DICT[DICT[lang] ? lang : 'en'];
    $all('[data-i18n]').forEach(node => {
      const path = node.getAttribute('data-i18n');
      if (!path) return;
      const val = path.split('.').reduce((acc,k)=>acc && acc[k], dict);
      if (typeof val === 'string') node.textContent = val;
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    i18nInit();
    setupNav();
    setupCopyright();
  });
})();
