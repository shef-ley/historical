// detail.js — slide-in panel showing individual person's events

function personSlugDetail(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function closeDetail() {
  const panel = document.getElementById('detail-panel');
  panel.classList.remove('open');
  setTimeout(() => { panel.style.display = 'none'; }, 300);
}

function openDetail(person) {
  const panel = document.getElementById('detail-panel');
  const slug = personSlugDetail(person.name);

  // Show loading state
  panel.style.display = 'flex';
  requestAnimationFrame(() => panel.classList.add('open'));

  document.getElementById('detail-name').textContent = person.name;
  document.getElementById('detail-lifespan').textContent =
    formatYear(person.born) + ' – ' + formatYear(person.died);
  document.getElementById('detail-summary').textContent = '';
  document.getElementById('detail-events').innerHTML = '<p class="loading">Loading events…</p>';
  document.getElementById('detail-wiki').href = 'https://en.wikipedia.org/wiki/' + person.wiki;

  // Color the header bar
  document.getElementById('detail-header').style.borderLeftColor = person.color;
  document.getElementById('detail-name').style.color = person.color;

  // Contemporaries
  const contemporaries = ALL_PEOPLE.filter(p =>
    p !== person && p.born < person.died && p.died > person.born
  ).sort((a, b) => Math.max(a.born, person.born) - Math.max(b.born, person.born));

  const contEl = document.getElementById('detail-contemporaries');
  if (contemporaries.length > 0) {
    contEl.innerHTML = '<h4>Contemporaries</h4>' +
      contemporaries.map(p => {
        const overlapStart = Math.max(p.born, person.born);
        const overlapEnd = Math.min(p.died, person.died);
        const years = Math.round(overlapEnd - overlapStart);
        return `<div class="contemporary-tag" style="border-left: 3px solid ${p.color}" onclick="openDetail(ALL_PEOPLE.find(x=>x.name==='${p.name}'))">
          <strong>${p.name}</strong>
          <span>${years} yr overlap</span>
        </div>`;
      }).join('');
  } else {
    contEl.innerHTML = '<p class="muted">No overlapping lives in this dataset.</p>';
  }

  // Try loading events file via script tag injection
  loadPersonEvents(slug, person);
}

function loadPersonEvents(slug, person) {
  // Remove any previously injected events script
  const old = document.getElementById('events-script');
  if (old) old.remove();

  // Clear previous PERSON_EVENTS if any
  window.PERSON_EVENTS = null;

  const script = document.createElement('script');
  script.id = 'events-script';
  script.src = 'data/events/' + slug + '.js';

  script.onload = () => {
    if (window.PERSON_EVENTS) {
      renderEvents(window.PERSON_EVENTS, person);
    } else {
      renderNoEvents(person);
    }
  };

  script.onerror = () => renderNoEvents(person);
  document.head.appendChild(script);
}

function renderEvents(data, person) {
  document.getElementById('detail-summary').textContent = data.summary || '';

  const container = document.getElementById('detail-events');
  container.innerHTML = data.events.map((ev, i) => `
    <div class="event-row">
      <div class="event-year" style="color: ${person.color}">${formatYear(ev.year)}</div>
      <div class="event-dot" style="background: ${person.color}"></div>
      <div class="event-label">${ev.label}</div>
    </div>
  `).join('');
}

function renderNoEvents(person) {
  document.getElementById('detail-events').innerHTML = `
    <p class="muted">No detailed events file yet for ${person.name}.</p>
    <p class="muted hint">To add events, create <code>data/events/${personSlugDetail(person.name)}.js</code> — see README for the format.</p>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('detail-close').addEventListener('click', closeDetail);
  document.getElementById('detail-backdrop').addEventListener('click', closeDetail);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });
});
