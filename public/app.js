const carousel = document.getElementById('community-carousel');
if (carousel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const track = carousel.querySelector('.community-track');
  for (const item of [...track.children]) {
    const copy = item.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
    track.appendChild(copy);
  }
  carousel.classList.add('is-scrolling');
}

const form = document.getElementById('interest-form');
const note = document.getElementById('form-note');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    communities: form.communities.value.trim() || 'none',
    _gotcha: form._gotcha.value,
    _subject: 'Interested: merge aarhus',
  };

  const button = form.querySelector('button');
  button.disabled = true;
  note.textContent = 'Sending…';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    note.textContent = 'Thanks! You are counted. We will be in touch.';
  } catch {
    note.textContent = 'Something went wrong. Email hello@merge-aarhus.dk instead.';
  } finally {
    button.disabled = false;
  }
});
