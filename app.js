document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
    });
  });
});
const navLinks = [...document.querySelectorAll('nav a')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id));
  }
}, {rootMargin: '-10% 0px -65% 0px', threshold: 0});
document.querySelectorAll('#home, #about, #work, #experience').forEach(section => observer.observe(section));

const contactForm = document.querySelector('form.contact-form');
const sendButton = contactForm.querySelector('button[type="submit"]');
const formStatus = contactForm.querySelector('.form-status');

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sendButton.disabled) return;

  sendButton.disabled = true;
  formStatus.textContent = 'Sending…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error('Form submission rejected');
    const result = await response.json();
    if (result.ok !== true) throw new Error('Form submission not confirmed');

    contactForm.reset();
    formStatus.textContent = 'Message sent. Thanks for reaching out!';
  } catch {
    formStatus.textContent = 'Could not confirm delivery. Try again, or use the email link.';
  } finally {
    sendButton.disabled = false;
  }
});
sendButton.disabled = false;
