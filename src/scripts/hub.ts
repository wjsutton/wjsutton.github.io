// Content Hub: search + single-select category chips (clicking the active chip
// reverts to All), ?cat= / ?q= in the URL, edge-anchored expand, tap-to-expand on touch.
const q = document.getElementById('q') as HTMLInputElement;
const grid = document.getElementById('grid')!;
const count = document.getElementById('count')!;
const empty = document.getElementById('empty')!;
const chips = [...document.querySelectorAll<HTMLButtonElement>('.chip')];
const cards = [...grid.querySelectorAll<HTMLLIElement>('.card')];
const labels = Object.fromEntries(chips.map((c) => [c.dataset.cat!, c.querySelector('span')!.textContent!]));

const params = new URLSearchParams(location.search);
let cat = params.get('cat') && labels[params.get('cat')!] ? params.get('cat')! : 'all';
q.value = params.get('q') ?? '';
if (cat !== 'all') (document.getElementById('back') as HTMLAnchorElement).href = '/#' + cat;

function edges() {
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  cards.filter((c) => !c.hidden).forEach((c, k) => {
    const col = k % cols;
    c.dataset.edge = col === 0 ? 'l' : col === cols - 1 ? 'r' : 'm';
  });
}

function render() {
  const s = q.value.trim().toLowerCase();
  chips.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
  let n = 0;
  for (const c of cards) {
    c.hidden = !((cat === 'all' || c.dataset.cat === cat) && (!s || c.dataset.search!.includes(s)));
    c.classList.remove('open');
    if (!c.hidden) n++;
  }
  edges();
  empty.hidden = n > 0;
  count.textContent = `${n} ${n === 1 ? 'item' : 'items'}${cat !== 'all' ? ' in ' + labels[cat] : ''}`;
  const p = new URLSearchParams();
  if (cat !== 'all') p.set('cat', cat);
  if (s) p.set('q', q.value.trim());
  history.replaceState(null, '', location.pathname + (p.size ? '?' + p : ''));
}

chips.forEach((b) => b.addEventListener('click', () => {
  cat = cat === b.dataset.cat && cat !== 'all' ? 'all' : b.dataset.cat!;
  render();
}));
q.addEventListener('input', render);
addEventListener('resize', edges);

// Touch: first tap expands a card, second tap follows it.
const touch = matchMedia('(hover: none)');
grid.addEventListener('click', (e) => {
  const card = (e.target as Element).closest<HTMLLIElement>('.card');
  if (!card || !touch.matches || card.classList.contains('open')) return;
  e.preventDefault();
  cards.forEach((c) => c.classList.toggle('open', c === card));
});
document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('.card')) cards.forEach((c) => c.classList.remove('open'));
});

render();
