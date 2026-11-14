/**
 * Luna Cat Portfolio — Main JavaScript
 * Handles animations, form validation, counters, and interactions.
 */

(function () {
  'use strict';

  /* ==========================================
     1. LOADING SCREEN
     Hides the loader after page assets load
     ========================================== */
  const loader = document.getElementById('loader');

  window.addEventListener('load', function () {
    // Small delay so the loading animation is visible
    setTimeout(function () {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });

  // Prevent scrolling while loading
  document.body.style.overflow = 'hidden';


  /* ==========================================
     2. NAVBAR SCROLL EFFECT
     Adds background when user scrolls down
     ========================================== */
  const navbar = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Run on page load


  /* ==========================================
     3. ACTIVE NAV LINK ON SCROLL
     Highlights the current section in nav
     ========================================== */
  const sections = document.querySelectorAll('section[id], header[id]');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);


  /* ==========================================
     4. SMOOTH SCROLLING
     Smooth scroll for anchor links
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        const navCollapse = document.getElementById('navMenu');
        if (navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });


  /* ==========================================
     5. FADE-IN ON SCROLL
     Uses Intersection Observer API
     ========================================== */
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });


  /* ==========================================
     6. ANIMATED SKILL BARS
     Progress bars fill when scrolled into view
     ========================================== */
  const skillItems = document.querySelectorAll('.skill-item');

  const skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateSkillBar(entry.target);
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillItems.forEach(function (item) {
    skillObserver.observe(item);
  });

  function animateSkillBar(item) {
    const target = parseInt(item.getAttribute('data-skill'), 10);
    const bar = item.querySelector('.progress-bar');
    const percentText = item.querySelector('.skill-percent');

    // Cuteness is 999% — cap the bar visually at 100%
    const barWidth = Math.min(target, 100);
    bar.style.width = barWidth + '%';

    // Animate the number counting up
    let current = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(target / (duration / 16)));

    const counter = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(counter);
      }
      percentText.textContent = current + '%';
    }, 16);
  }


  /* ==========================================
     7. PORTFOLIO GALLERY FILTER
     Show/hide gallery items by category
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          item.offsetHeight; // Trigger reflow
          item.style.animation = '';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* ==========================================
     8. GALLERY MODAL
     Populate Bootstrap modal with clicked image
     ========================================== */
  const imageModal = document.getElementById('imageModal');

  if (imageModal) {
    imageModal.addEventListener('show.bs.modal', function (event) {
      const card = event.relatedTarget;
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');

      document.getElementById('modalImage').src = imgSrc;
      document.getElementById('modalImage').alt = title;
      document.getElementById('imageModalLabel').textContent = title;
      document.getElementById('modalDesc').textContent = desc;
    });
  }


  /* ==========================================
     9. ANIMATED STATISTICS COUNTERS
     Count up numbers when stats section is visible
     ========================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const statsSection = document.getElementById('stats');

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statNumbers.forEach(function (stat) {
            animateCounter(stat);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }


  /* ==========================================
     10. CONTACT FORM VALIDATION
     Frontend-only validation with Bootstrap styles
     ========================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const messageInput = document.getElementById('contactMessage');

      let isValid = true;

      // Validate name
      if (nameInput.value.trim().length < 2) {
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
        isValid = false;
      } else {
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
      }

      // Validate email with regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        emailInput.classList.remove('is-valid');
        isValid = false;
      } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
      }

      // Validate message
      if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('is-invalid');
        messageInput.classList.remove('is-valid');
        isValid = false;
      } else {
        messageInput.classList.remove('is-invalid');
        messageInput.classList.add('is-valid');
      }

      if (isValid) {
        // Show success message (no backend — demo only)
        formSuccess.classList.remove('d-none');
        contactForm.reset();

        // Remove validation classes after reset
        [nameInput, emailInput, messageInput].forEach(function (input) {
          input.classList.remove('is-valid');
        });

        // Hide success message after 5 seconds
        setTimeout(function () {
          formSuccess.classList.add('d-none');
        }, 5000);
      }

      contactForm.classList.add('was-validated');
    });

    // Clear invalid state on input
    contactForm.querySelectorAll('.form-control').forEach(function (input) {
      input.addEventListener('input', function () {
        if (this.classList.contains('is-invalid')) {
          this.classList.remove('is-invalid');
        }
      });
    });
  }


  /* ==========================================
     11. BACK TO TOP BUTTON
     Show/hide and scroll to top on click
     ========================================== */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

})();
