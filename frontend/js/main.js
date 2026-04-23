const API_BASE = '/api';
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.25)' : 'none'; });
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => { a.addEventListener('click', () => navLinks.classList.remove('open')); });
const tabs = document.querySelectorAll('.cta-tab');
const fSaver = document.getElementById('form-saver');
const fOp = document.getElementById('form-operator');
tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); const type = tab.dataset.tab; fSaver.classList.toggle('hidden', type !== 'saver'); fOp.classList.toggle('hidden', type !== 'operator'); }); });
async function submitForm(form) { const type = form.dataset.type; const data = Object.fromEntries(new FormData(form)); const btn = form.querySelector('button[type="submit"]'); const success = document.getElementById('form-success'); btn.disabled = true; btn.textContent = 'Sending…'; try { const res = await fetch(API_BASE + (type === 'operator' ? '/operator' : '/waitlist'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, type }) }); if (!res.ok) throw new Error('error'); form.classList.add('hidden'); document.querySelector('.cta-tabs').style.display = 'none'; success.classList.remove('hidden'); } catch { btn.disabled = false; btn.textContent = type === 'operator' ? 'Register as an operator' : 'Join the waitlist'; } }
document.querySelectorAll('.cta-form').forEach(form => { form.addEventListener('submit', e => { e.preventDefault(); submitForm(form); }); });
const io = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; io.unobserve(e.target); } }); }, { threshold: 0.1 });
document.querySelectorAll('.feature-card, .step, .op-card, .pricing-card, .wa-phone').forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; io.observe(el); });
