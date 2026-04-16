/* ===========================
   1. Mobile Menu Toggle
   =========================== */
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navActions.classList.toggle('active');
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navActions.classList.remove('active');
    });
  });
}

/* ===========================
   2. Navbar Scroll Effect
   =========================== */
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ===========================
   3. FAQ Accordion
   =========================== */
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('active');
    });

    // Toggle the clicked item
    if (!isOpen) {
      item.classList.add('active');
    }
  });
});

/* ===========================
   4. Waitlist Tab Toggle
   =========================== */
const tabButtons = document.querySelectorAll('.tab-btn');
const waitlistForms = document.querySelectorAll('.waitlist-form');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');

    // Update active tab button
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show the matching form, hide others
    waitlistForms.forEach(form => {
      form.classList.remove('active');
    });

    const targetForm = document.getElementById(targetTab + '-form');
    if (targetForm) {
      targetForm.classList.add('active');
    }
  });
});

/* ===========================
   5. Form Submission
   =========================== */
const API_BASE = '/api';

async function submitForm(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Disable button and show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  // Clear previous errors
  const existingError = form.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }

  // Gather form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Determine form type
  const isOperator = form.id === 'operator-form';
  data.type = isOperator ? 'operator' : 'saver';

  try {
    const response = await fetch(API_BASE + '/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Submission failed');
    }

    // Show success state
    form.style.display = 'none';

    // Create or show success message
    let success = form.parentElement.querySelector('.form-success');
    if (!success) {
      success = document.createElement('div');
      success.className = 'form-success';
      success.innerHTML = `
        <div class="success-icon">&#10003;</div>
        <h3>You're on the list!</h3>
        <p>We'll notify you as soon as SoSave is ready. Keep an eye on your inbox.</p>
      `;
      form.parentElement.appendChild(success);
    }
    success.classList.add('active');

  } catch (err) {
    // Show error message
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    let error = form.querySelector('.form-error');
    if (!error) {
      error = document.createElement('p');
      error.className = 'form-error';
      error.style.cssText = 'color:#E8593C;font-size:13px;text-align:center;margin-top:8px;';
      form.appendChild(error);
    }
    error.textContent = 'Something went wrong. Please try again or email blaisepl54@gmail.com';
  }
}

// Attach submit handlers to both waitlist forms
document.querySelectorAll('.waitlist-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(form);
  });
});

// Also attach to any .cta-form elements
document.querySelectorAll('.cta-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(form);
  });
});

/* ===========================
   6. Scroll Animations
   =========================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.feature-card, .step, .op-card, .pricing-card, .score-sector, .unlock-item, .whatsapp-features li, .trust-stat, .hero-stat'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

/* ===========================
   7. Smooth Scroll for Anchor Links
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  });
});
