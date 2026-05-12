/* ============================================================
   HongKongVilla.com — Main JavaScript
   Scroll animations, navigation, FAQ accordion, mood bars
   ============================================================ */

(function () {
  'use strict';

  // --- Header scroll effect ---
  const header = document.querySelector('.site-header');

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // --- Mobile menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
      menuToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Scroll fade-in animations ---
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: show all
    fadeElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // --- Mood bar animations ---
  const moodBars = document.querySelectorAll('.mood-bar-fill');

  if ('IntersectionObserver' in window && moodBars.length > 0) {
    const moodObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = entry.target;
            var width = target.getAttribute('data-width');
            if (width) {
              target.style.width = width;
            }
            target.classList.add('is-visible');
            moodObserver.unobserve(target);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    moodBars.forEach(function (bar) {
      moodObserver.observe(bar);
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // Close all others
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          var otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('is-open');
      question.setAttribute('aria-expanded', !isOpen);
    });

    // Keyboard accessibility
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Lazy loading images (native + fallback) ---
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading — nothing extra needed
  } else {
    // Fallback for older browsers
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            imgObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function (img) {
        imgObserver.observe(img);
      });
    }
  }
})();
