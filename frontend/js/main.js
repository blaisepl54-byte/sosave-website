const API_BASE = '/api';

// Nav: subtle shadow on scroll
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.25)' : 'none';
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const closeNav = () => {
  navLinks?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
};
navToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});

// Waitlist tab switching
const tabs = document.querySelectorAll('.waitlist-tab');
const forms = {
  saver: document.getElementById('form-saver'),
  operator: document.getElementById('form-operator'),
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const type = tab.dataset.tab;
    tabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    Object.entries(forms).forEach(([key, form]) => {
      if (form) form.classList.toggle('is-active', key === type);
    });
  });
});

// Waitlist form submission
async function submitForm(form) {
  const type = form.id === 'form-operator' ? 'operator' : 'saver';
  const data = Object.fromEntries(new FormData(form));
  const btn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('form-success');
  const tabsEl = document.querySelector('.waitlist-tabs');
  const originalText = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch(API_BASE + (type === 'operator' ? '/operator' : '/waitlist'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type }),
    });
    if (!res.ok) throw new Error('error');
    document.querySelectorAll('.waitlist-form').forEach(f => f.classList.remove('is-active'));
    if (tabsEl) tabsEl.style.display = 'none';
    if (success) success.hidden = false;
  } catch {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

document.querySelectorAll('.waitlist-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(form);
  });
});

// Scroll-in fade animations
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .step, .op-card, .pricing-card, .phone-mockup').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  io.observe(el);
});
