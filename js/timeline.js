// timeline.js — main view: horizontal bars, zoom/pan, overlap highlighting

const PADDING = { top: 60, bottom: 40, left: 220, right: 40 };
const BAR_HEIGHT = 22;
const BAR_GAP = 8;
const MIN_YEAR = -500;
const MAX_YEAR = 1970;

let canvas, ctx;
let viewMin = MIN_YEAR, viewMax = MAX_YEAR;
let hoveredPerson = null;
let isDragging = false;
let dragStartX = 0;
let dragStartMin = 0;

function personSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function yearToX(year) {
  const w = canvas.width - PADDING.left - PADDING.right;
  return PADDING.left + (year - viewMin) / (viewMax - viewMin) * w;
}

function xToYear(x) {
  const w = canvas.width - PADDING.left - PADDING.right;
  return viewMin + (x - PADDING.left) / w * (viewMax - viewMin);
}

function formatYear(y) {
  if (y < 0) return Math.abs(Math.round(y)) + ' BCE';
  return Math.round(y) + ' CE';
}

function draw() {
  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const totalRows = PEOPLE.length;
  const neededHeight = PADDING.top + totalRows * (BAR_HEIGHT + BAR_GAP) + PADDING.bottom;
  if (canvas.style) {
    const cssHeight = Math.max(neededHeight / dpr, 400);
    if (parseInt(canvas.style.height) !== cssHeight) {
      canvas.style.height = cssHeight + 'px';
      canvas.height = cssHeight * dpr;
    }
  }

  // Background
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines & year labels
  const yearRange = viewMax - viewMin;
  let tickInterval = 50;
  if (yearRange > 2000) tickInterval = 500;
  else if (yearRange > 800) tickInterval = 200;
  else if (yearRange > 400) tickInterval = 100;
  else if (yearRange > 150) tickInterval = 50;
  else if (yearRange > 60) tickInterval = 20;
  else tickInterval = 10;

  const firstTick = Math.ceil(viewMin / tickInterval) * tickInterval;
  ctx.strokeStyle = 'rgba(128,128,128,0.15)';
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(128,128,128,0.6)';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';

  for (let yr = firstTick; yr <= viewMax; yr += tickInterval) {
    const x = yearToX(yr);
    if (x < PADDING.left || x > canvas.width - PADDING.right) continue;
    ctx.beginPath();
    ctx.moveTo(x, PADDING.top - 20);
    ctx.lineTo(x, canvas.height - PADDING.bottom);
    ctx.stroke();
    ctx.fillText(formatYear(yr), x, PADDING.top - 24);
  }

  // Group label backgrounds
  let lastRegion = null;
  let regionStartY = PADDING.top;

  // Draw bars
  PEOPLE.forEach((person, i) => {
    const y = PADDING.top + i * (BAR_HEIGHT + BAR_GAP);
    const x1 = Math.max(yearToX(person.born), PADDING.left);
    const x2 = Math.min(yearToX(person.died), canvas.width - PADDING.right);
    const isHovered = hoveredPerson === person;

    // Region divider
    if (person.region !== lastRegion) {
      if (lastRegion !== null) {
        ctx.strokeStyle = 'rgba(128,128,128,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y - BAR_GAP / 2);
        ctx.lineTo(canvas.width, y - BAR_GAP / 2);
        ctx.stroke();
      }
      lastRegion = person.region;
    }

    // Name label
    ctx.fillStyle = isHovered ? '#111111' : 'rgba(30,30,30,0.85)';
    ctx.font = isHovered ? '500 13px system-ui, sans-serif' : '13px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(person.name, PADDING.left - 10, y + BAR_HEIGHT / 2 + 4);

    if (x2 <= x1) return;

    // Overlap highlight — check against all other people
    const overlappers = PEOPLE.filter(other =>
      other !== person &&
      other.born < person.died &&
      other.died > person.born
    );

    if (isHovered && overlappers.length > 0) {
      // Highlight the overlapping region on this bar
      overlappers.forEach(other => {
        const ox1 = Math.max(yearToX(Math.max(person.born, other.born)), PADDING.left);
        const ox2 = Math.min(yearToX(Math.min(person.died, other.died)), canvas.width - PADDING.right);
        if (ox2 > ox1) {
          ctx.fillStyle = 'rgba(255,220,60,0.35)';
          ctx.fillRect(ox1, y - 2, ox2 - ox1, BAR_HEIGHT + 4);
        }
      });
    }

    // Bar
    ctx.fillStyle = isHovered ? person.color : person.color + 'cc';
    ctx.beginPath();
    ctx.roundRect(x1, y, Math.max(x2 - x1, 2), BAR_HEIGHT, 4);
    ctx.fill();

    // Lifespan text inside bar if wide enough
    const barWidth = x2 - x1;
    if (barWidth > 60) {
      const label = formatYear(person.born) + ' – ' + formatYear(person.died);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, x1 + 6, y + BAR_HEIGHT / 2 + 3);
    }

    // Hover: draw tooltip
    if (isHovered) {
      const mx = (x1 + x2) / 2;
      const tooltipText = overlappers.length > 0
        ? `Overlapped with: ${overlappers.slice(0, 3).map(o => o.name).join(', ')}${overlappers.length > 3 ? '…' : ''}`
        : 'No overlaps visible in current view';
      
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      const tw = ctx.measureText(tooltipText).width;
      const tx = Math.min(Math.max(mx, PADDING.left + tw / 2 + 8), canvas.width - PADDING.right - tw / 2 - 8);
      const ty = y - 10;

      ctx.fillStyle = 'rgba(20,20,20,0.88)';
      ctx.beginPath();
      ctx.roundRect(tx - tw / 2 - 8, ty - 18, tw + 16, 22, 4);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(tooltipText, tx, ty - 2);
    }
  });

  // Region labels on right side
  lastRegion = null;
  let regionY = PADDING.top;
  PEOPLE.forEach((person, i) => {
    const y = PADDING.top + i * (BAR_HEIGHT + BAR_GAP);
    if (person.region !== lastRegion) {
      if (lastRegion !== null) {
        const midY = (regionY + y) / 2 - (BAR_HEIGHT + BAR_GAP);
        // already drawn bars, skip
      }
      lastRegion = person.region;
      regionY = y;
    }
  });
}

function getPersonAtY(mouseY) {
  for (let i = 0; i < PEOPLE.length; i++) {
    const y = PADDING.top + i * (BAR_HEIGHT + BAR_GAP);
    if (mouseY >= y && mouseY <= y + BAR_HEIGHT) return PEOPLE[i];
  }
  return null;
}

function initTimeline() {
  canvas = document.getElementById('timeline-canvas');
  ctx = canvas.getContext('2d');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.parentElement.clientWidth;
    canvas.style.width = cssWidth + 'px';
    canvas.width = cssWidth * dpr;
    const totalRows = PEOPLE.length;
    const cssHeight = Math.max(PADDING.top + totalRows * (BAR_HEIGHT + BAR_GAP) + PADDING.bottom, 400);
    canvas.style.height = cssHeight + 'px';
    canvas.height = cssHeight * dpr;
    ctx.scale(dpr, dpr);
    draw();
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse move — hover
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDragging) {
      const dx = mx - dragStartX;
      const range = viewMax - viewMin;
      const yearPerPx = range / (canvas.getBoundingClientRect().width - PADDING.left - PADDING.right);
      viewMin = dragStartMin - dx * yearPerPx;
      viewMax = viewMin + range;
      draw();
      return;
    }

    const person = getPersonAtY(my);
    if (person !== hoveredPerson) {
      hoveredPerson = person;
      canvas.style.cursor = person ? 'pointer' : 'default';
      draw();
    }
  });

  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    dragStartX = e.clientX - rect.left;
    dragStartMin = viewMin;
    canvas.style.cursor = 'grabbing';
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = hoveredPerson ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    hoveredPerson = null;
    canvas.style.cursor = 'default';
    draw();
  });

  // Click — open detail panel
  canvas.addEventListener('click', e => {
    if (isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    const person = getPersonAtY(my);
    if (person) openDetail(person);
  });

  // Scroll wheel zoom
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const mouseYear = xToYear(mx);
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.87;
    const range = viewMax - viewMin;
    const newRange = Math.min(Math.max(range * zoomFactor, 20), 2500);
    const ratio = (mouseYear - viewMin) / range;
    viewMin = mouseYear - ratio * newRange;
    viewMax = viewMin + newRange;
    draw();
  }, { passive: false });

  // Touch support
  let lastTouchDist = null;
  let lastTouchMidX = null;

  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      dragStartMin = viewMin;
    }
  });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - canvas.getBoundingClientRect().left;
      if (lastTouchDist !== null) {
        const factor = lastTouchDist / dist;
        const mouseYear = xToYear(midX);
        const range = viewMax - viewMin;
        const newRange = Math.min(Math.max(range * factor, 20), 2500);
        const ratio = (mouseYear - viewMin) / range;
        viewMin = mouseYear - ratio * newRange;
        viewMax = viewMin + newRange;
        draw();
      }
      lastTouchDist = dist;
    } else if (e.touches.length === 1 && isDragging) {
      const mx = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      const dx = mx - dragStartX;
      const range = viewMax - viewMin;
      const yearPerPx = range / (canvas.getBoundingClientRect().width - PADDING.left - PADDING.right);
      viewMin = dragStartMin - dx * yearPerPx;
      viewMax = viewMin + range;
      draw();
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    isDragging = false;
    lastTouchDist = null;
  });

  // Zoom buttons
  document.getElementById('zoom-in').addEventListener('click', () => {
    const mid = (viewMin + viewMax) / 2;
    const range = (viewMax - viewMin) * 0.6;
    viewMin = mid - range / 2;
    viewMax = mid + range / 2;
    draw();
  });

  document.getElementById('zoom-out').addEventListener('click', () => {
    const mid = (viewMin + viewMax) / 2;
    const range = Math.min((viewMax - viewMin) * 1.5, 2500);
    viewMin = mid - range / 2;
    viewMax = mid + range / 2;
    draw();
  });

  document.getElementById('reset-view').addEventListener('click', () => {
    viewMin = MIN_YEAR;
    viewMax = MAX_YEAR;
    hoveredPerson = null;
    draw();
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const region = btn.dataset.region;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (region === 'all') {
        // Reset PEOPLE to full list — we need to reload from source
        PEOPLE.splice(0, PEOPLE.length, ...ALL_PEOPLE);
      } else {
        PEOPLE.splice(0, PEOPLE.length, ...ALL_PEOPLE.filter(p => p.region === region));
      }
      hoveredPerson = null;
      draw();
    });
  });
}
