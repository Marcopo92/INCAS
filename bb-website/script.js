/* =============================================
   Casa Mia B&B - JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.navbar-menu');
  const overlay = document.querySelector('.menu-overlay');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu on link click
  document.querySelectorAll('.navbar-menu a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // --- Scroll Animations ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

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
    checkVisibility(); // check on load
  }

  // --- Active nav link highlight ---
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-menu a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // --- Form Validation ---
  function setupFormValidation(formId, successId) {
    var form = document.getElementById(formId);
    var success = document.getElementById(successId);

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      // Clear previous errors
      form.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });
      form.querySelectorAll('.error-message').forEach(function (el) {
        el.classList.remove('visible');
      });

      // Validate required fields
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          var msg = field.parentElement.querySelector('.error-message');
          if (msg) {
            msg.textContent = 'Questo campo è obbligatorio';
            msg.classList.add('visible');
          }
          return;
        }

        // Email validation
        if (field.type === 'email') {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            var msg = field.parentElement.querySelector('.error-message');
            if (msg) {
              msg.textContent = 'Inserisci un indirizzo email valido';
              msg.classList.add('visible');
            }
          }
        }

        // Phone validation
        if (field.type === 'tel' && field.value.trim()) {
          var phoneRegex = /^[+]?[\d\s()-]{7,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            var msg = field.parentElement.querySelector('.error-message');
            if (msg) {
              msg.textContent = 'Inserisci un numero di telefono valido';
              msg.classList.add('visible');
            }
          }
        }
      });

      // Date validation for booking form
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
            msg.textContent = 'La data di check-in non può essere nel passato';
            msg.classList.add('visible');
          }
        }

        if (checkoutDate <= checkinDate) {
          isValid = false;
          checkout.classList.add('error');
          var msg = checkout.parentElement.querySelector('.error-message');
          if (msg) {
            msg.textContent = 'Il check-out deve essere dopo il check-in';
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

  // Initialize form validations
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
