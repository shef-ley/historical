# Lives in Context — Interactive History Timeline

A browser-based interactive timeline showing how historical figures' lives overlapped — even when they're taught in separate units.

## Features

- **28 historical figures** across 7 eras, displayed as color-coded horizontal bars
- **Hover** any bar to see which other figures were alive at the same time (highlighted in yellow)
- **Click** any bar to open a detail panel with a biography summary, key life events, and a list of contemporaries
- **Zoom & pan** — scroll wheel zooms, click+drag pans, or use the toolbar buttons
- **Filter by era** using the toolbar buttons
- **Wikipedia link** in every detail panel
- Works on `file://` with no server needed (uses script-tag injection for event files)

## Running locally

Open `index.html` directly in your browser. No build step, no server required.

## File structure

```
index.html                 — app shell + boot
css/style.css              — all styles (light + dark mode)
js/
  timeline.js              — canvas rendering, zoom/pan, hover overlaps
  detail.js                — slide-in detail panel
data/
  people.js                — PEOPLE array + REGION_ORDER
  events/
    leonardo-da-vinci.js   — events for Leonardo
    michelangelo.js        — events for Michelangelo
    albert-einstein.js     — events for Einstein
    marie-curie.js         — events for Curie
    nikola-tesla.js        — events for Tesla
    frederick-douglass.js  — events for Douglass
    (add more here)
```

## Adding events for a person

1. Find the slug: lowercase name, spaces → hyphens, remove special characters.  
   `"Isaac Newton"` → `isaac-newton`, `"Julius Caesar"` → `julius-caesar`

2. Create `data/events/<slug>.js` using this format:

```js
const PERSON_EVENTS = {
  name: "Isaac Newton",
  born: 1643,
  died: 1727,
  color: "#378ADD",
  wiki: "Isaac_Newton",
  summary: "One sentence bio summary here.",
  events: [
    { year: 1643, label: "Born in Woolsthorpe, Lincolnshire" },
    { year: 1661, label: "Entered Trinity College, Cambridge" },
    { year: 1687, label: "Published Principia Mathematica" },
    { year: 1727, label: "Died in London, age 84" },
  ]
};
```

3. That's it — no other changes needed. The detail panel auto-loads it by slug.

## Adding a new person

Add an entry to `data/people.js`:

```js
{ name: "Isaac Newton", born: 1643, died: 1727, region: "Enlightenment", color: "#378ADD", wiki: "Isaac_Newton" }
```

- `born` / `died`: year as integer (negative = BCE)
- `region`: must match one of the strings in `REGION_ORDER`
- `wiki`: Wikipedia article slug (the part after `en.wikipedia.org/wiki/`)

## Regions (current)

| Region | Era |
|--------|-----|
| Ancient Greece | ~500–300 BCE |
| Ancient Rome | ~100 BCE–14 CE |
| Renaissance | 1450–1550 |
| Enlightenment | 1630–1800 |
| American Founding | 1730–1830 |
| 19th Century | 1800–1900 |
| Early 20th Century | 1850–1970 |

## Deploying to GitHub Pages

1. Push to GitHub
2. Settings → Pages → Source: `main` branch, `/ (root)` folder
3. Done — no build step needed

## Roadmap ideas

- [ ] More events files (Newton, Lincoln, Voltaire, Caesar, …)
- [ ] Animated zoom into an era on filter click
- [ ] Overlap matrix view (who overlapped with whom, by how many years)
- [ ] "Did they meet?" mode — highlight plausible connections
- [ ] Second-level detail (click an event → see context)
