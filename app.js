// Reading-mode switcher
const modes = {
  read: ['Read', 'Selectable, searchable text with real links, typeset by the box\u2019s own layout rules.'],
  watch: ['Watch', 'The story as video, embedded at the shape of its source: vertical for Shorts, widescreen for long-form.'],
  listen: ['Listen', 'The box reads itself aloud, or plays the original interview audio.'],
  both: ['Listen while reading', 'Audio plays while the text follows along on the page.']
};
document.querySelectorAll('.mode').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode').forEach(b => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('is-on'); btn.setAttribute('aria-pressed', 'true');
    const [t, c] = modes[btn.dataset.mode];
    document.getElementById('mode-type').textContent = t;
    document.getElementById('mode-copy').textContent = c;
  });
});

// Algorithm box demo (illustrative values only)
const stories = [
  { t: 'The price of a hot take', age: 0.1, att: 0.9, floor: 1 },
  { t: 'Who funds the feed?', age: 2.5, att: 0.85, floor: 1 },
  { t: 'Dossier: the zoning vote', age: 0.4, att: 0.5, floor: 2 },
  { t: 'Field note: Main Street', age: 1.2, att: 0.2, floor: 1 },
  { t: 'Interview: a local editor', age: 0.8, att: 0.45, floor: 1 },
  { t: 'Explainer: how ranking works', age: 3, att: 0.3, floor: 1 },
  { t: 'Gallery: town hall', age: 0.2, att: 0.65, floor: 1 },
  { t: 'Letters', age: 1.8, att: 0.1, floor: 1 }
];
const grid = document.getElementById('demo-grid');
const w = document.getElementById('w'), d = document.getElementById('d'), f = document.getElementById('f');
function render() {
  const W = w.value / 100, D = d.value / 100, F = f.checked;
  document.getElementById('w-out').textContent = w.value;
  document.getElementById('d-out').textContent = d.value;
  document.getElementById('f-out').textContent = F ? 'On' : 'Off';
  const scored = stories.map(s => {
    const decayed = s.att * Math.exp(-D * s.age);
    const mult = 1 + W * 3 * decayed;
    let size = (F ? s.floor : 1) * mult;
    size = size >= 3 ? 4 : size >= 1.8 ? 2 : 1;
    return { ...s, size, score: decayed };
  }).sort((a, b) => b.size - a.size || b.score - a.score);
  grid.innerHTML = scored.map(s => {
    const span = s.size === 4 ? 'grid-column:span 2;grid-row:span 2' : s.size === 2 ? 'grid-column:span 2' : '';
    return `<div class="dbox s${s.size}" style="${span}"><b>${s.t}</b><span>${s.size === 4 ? '2\u00d72' : s.size === 2 ? '2\u00d71' : '1\u00d71'} \u00b7 ${(s.score * 100).toFixed(0)}</span></div>`;
  }).join('');
}
[w, d, f].forEach(el => el.addEventListener('input', render));
render();
