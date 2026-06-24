/* =============================================================
   NUZA TRAVEL BLOG — Shared JavaScript
   Deferred, non-blocking, no external dependencies
   ============================================================= */

(function () {
  'use strict';

  /* ── Dark Mode ── */
  const savedTheme = localStorage.getItem('nuza-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    updateThemeIcons();
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nuza-theme', next);
      updateThemeIcons();
    });
  }
  function updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sun = document.getElementById('iconSun');
    const moon = document.getElementById('iconMoon');
    if (sun) sun.style.display = isDark ? 'block' : 'none';
    if (moon) moon.style.display = isDark ? 'none' : 'block';
  }

  /* ── Navbar Scroll ── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    // Blog pages always show the solid navbar (not transparent hero style)
    navbar.classList.add('scrolled');
  }

  /* ── Mobile Menu ── */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  /* ── Scroll Reveal ── */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ── FAQ Accordion ── */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q');
      if (!q) return;
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all others
        document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── Table of Contents active link ── */
  function initTocHighlight() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    if (!tocLinks.length) return;
    const headings = Array.from(document.querySelectorAll('.article-content h2, .article-content h3'));
    if (!headings.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -60% 0px' });
    headings.forEach(h => { if (h.id) obs.observe(h); });
  }

  /* ── Reading Progress Bar ── */
  function initReadingProgress() {
    const bar = document.getElementById('readingProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ── Share Buttons ── */
  function initShareButtons() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const twitterBtn = document.getElementById('shareTwitter');
    const fbBtn = document.getElementById('shareFacebook');
    const waBtn = document.getElementById('shareWhatsApp');
    const copyBtn = document.getElementById('shareCopy');

    if (twitterBtn) {
      twitterBtn.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    }
    if (fbBtn) {
      fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }
    if (waBtn) {
      waBtn.href = `https://wa.me/?text=${title}%20${url}`;
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = original; }, 2000);
        });
      });
    }
  }

  /* ── Keyboard: close modals on Escape ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.mobile-menu.open').forEach(m => m.classList.remove('open'));
    }
  });

  /* ── Init all ── */
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbar();
    initMobileMenu();
    initReveal();
    initFAQ();
    initTocHighlight();
    initReadingProgress();
    initShareButtons();
  });

})();
