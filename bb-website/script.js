/* =============================================
   INCAS B&B - JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Language Switcher ---
  var currentLang = localStorage.getItem('incas-lang') || 'it';

  function applyTranslations(lang) {
    currentLang = lang;
    localStorage.setItem('incas-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (translations[key] && translations[key][lang]) {
        el.innerHTML = translations[key][lang];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (translations[key] && translations[key][lang]) {
        el.setAttribute('placeholder', translations[key][lang]);
      }
    });

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var lang = this.getAttribute('data-lang');
      applyTranslations(lang);
      // Close mobile menu if open
      closeMenu();
    });
  });

  // Apply saved language on load
  if (typeof translations !== 'undefined') {
    applyTranslations(currentLang);
  }

  // --- Mobile Menu ---
  var hamburger = document.querySelector('.hamburger');
  var navMenu = document.querySelector('.navbar-menu');
  var overlay = document.querySelector('.menu-overlay');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu on nav link click
  document.querySelectorAll('.navbar-menu a[href]').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // --- Scroll Animations ---
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  function checkVisibility() {
    var triggerBottom = window.innerHeight * 0.85;
    animatedElements.forEach(function (el) {
      var box = el.getBoundingClientRect();
      if (box.top < triggerBottom) {
        el.classList.add('visible');
      }
    });
  }

  if (animatedElements.length > 0) {
    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
  }

  // --- Active nav link highlight ---
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-menu a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // --- Form Validation ---
  function getValidationMsg(key) {
    if (typeof translations !== 'undefined' && translations[key] && translations[key][currentLang]) {
      return translations[key][currentLang];
    }
    return '';
  }

  function setupFormValidation(formId, successId) {
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      form.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });
      form.querySelectorAll('.error-message').forEach(function (el) {
        el.classList.remove('visible');
      });

      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          var msg = field.parentElement.querySelector('.error-message');
          if (msg) {
            msg.textContent = getValidationMsg('validation.required');
            msg.classList.add('visible');
          }
          return;
        }

        if (field.type === 'email') {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            var msg = field.parentElement.querySelector('.error-message');
            if (msg) {
              msg.textContent = getValidationMsg('validation.email');
              msg.classList.add('visible');
            }
          }
        }

        if (field.type === 'tel' && field.value.trim()) {
          var phoneRegex = /^[+]?[\d\s()-]{7,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            var msg = field.parentElement.querySelector('.error-message');
            if (msg) {
              msg.textContent = getValidationMsg('validation.phone');
              msg.classList.add('visible');
            }
          }
        }
      });

      var checkin = form.querySelector('#checkin');
      var checkout = form.querySelector('#checkout');

      if (checkin && checkout && checkin.value && checkout.value) {
        var checkinDate = new Date(checkin.value);
        var checkoutDate = new Date(checkout.value);
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkinDate < today) {
          isValid = false;
          checkin.classList.add('error');
          var msg = checkin.parentElement.querySelector('.error-message');
          if (msg) {
            msg.textContent = getValidationMsg('validation.checkin.past');
            msg.classList.add('visible');
          }
        }

        if (checkoutDate <= checkinDate) {
          isValid = false;
          checkout.classList.add('error');
          var msg = checkout.parentElement.querySelector('.error-message');
          if (msg) {
            msg.textContent = getValidationMsg('validation.checkout.before');
            msg.classList.add('visible');
          }
        }
      }

      if (isValid) {
        form.style.display = 'none';
        if (success) {
          success.classList.add('visible');
        }
      }
    });
  }

  setupFormValidation('booking-form', 'booking-success');
  setupFormValidation('contact-form', 'contact-success');

  // --- Set minimum date for date inputs ---
  var dateInputs = document.querySelectorAll('input[type="date"]');
  if (dateInputs.length > 0) {
    var today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(function (input) {
      input.setAttribute('min', today);
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
