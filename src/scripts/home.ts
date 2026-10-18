// Home page section state: one full-screen section at a time on desktop,
// a natural scroll feed on mobile. Section count comes from the DOM.
import { desktop, reduceMotion } from './media';

const sections = [...document.querySelectorAll<HTMLElement>('.section')];
const navItems = [...document.querySelectorAll<HTMLLIElement>('#menu li')];
const backdrops = [...document.querySelectorAll<HTMLElement>('.bd-img')];
const menu = document.getElementById('menu')!;
const burger = document.getElementById('burger')!;
const MAX = sections.length - 1;
let active = 0;

const scrollerOf = (i: number) => sections[i]?.querySelector<HTMLElement>('.scroller') ?? null;
const canScroll = (el: HTMLElement | null): el is HTMLElement => !!el && el.scrollHeight > el.clientHeight + 2;
const atEdge = (el: HTMLElement, up: boolean) =>
  up ? el.scrollTop <= 0 : el.scrollTop + el.clientHeight >= el.scrollHeight - 2;

function setActive(i: number) {
  if (i === active || i < 0 || i > MAX) return;
  const prev = active;
  active = i;
  document.documentElement.style.setProperty('--dir', i > prev ? '1' : '-1');

  navItems.forEach((li) => {
    const on = Number(li.dataset.i) === i;
    li.classList.toggle('active', on);
    const a = li.querySelector('a')!;
    if (on) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
  sections.forEach((s, k) => {
    s.classList.toggle('is-active', k === i);
    s.classList.toggle('leaving', k === prev);
  });
  setTimeout(() => sections[prev].classList.remove('leaving'), 520);

  // Entering from above starts at the top, from below at the bottom.
  const sc = scrollerOf(i);
  if (sc && desktop.matches) sc.scrollTop = i > prev ? 0 : sc.scrollHeight;

  backdrops.forEach((b) => b.classList.toggle('is-active', b.dataset.sections!.split(' ').includes(String(i))));
  history.replaceState(null, '', '#' + sections[i].id);
  dispatchEvent(new CustomEvent('section-change', { detail: i }));
}

function goTo(i: number) {
  if (desktop.matches) return setActive(i);
  const behavior = reduceMotion.matches ? 'auto' : 'smooth';
  if (i === 0) scrollTo({ top: 0, behavior });
  else sections[i].scrollIntoView({ behavior });
}

/* Wheel: one section per gesture. A burst of events with gaps < 220ms is one
   gesture; it switches after 24px of delta, then locks for 720ms. A gesture
   that scrolled Connect's content must end before it can switch section. */
let wheelLock = false, lastWheel = 0, gestureUsed = false, startedAtEdge = true, acc = 0;
addEventListener('wheel', (e) => {
  if (!desktop.matches) return;
  const now = Date.now(), fresh = now - lastWheel > 220;
  lastWheel = now;
  const sc = (e.target as Element).closest?.<HTMLElement>('.section.is-active .scroller') ?? null;
  const edge = !canScroll(sc) || atEdge(sc, e.deltaY < 0);
  if (fresh) { gestureUsed = false; acc = 0; startedAtEdge = edge; }
  if (!edge) { startedAtEdge = false; return; }
  if (!startedAtEdge || gestureUsed || wheelLock) return;
  acc += e.deltaY;
  if (Math.abs(acc) < 24) return;
  gestureUsed = true;
  const next = active + (acc > 0 ? 1 : -1);
  if (next < 0 || next > MAX) return; // bottom of Connect: do nothing
  wheelLock = true;
  setActive(next);
  setTimeout(() => (wheelLock = false), 720);
}, { passive: true });

/* Keyboard mirrors the wheel. Inside Connect the keys scroll its content
   first and only change section at the edges. */
addEventListener('keydown', (e) => {
  if (!desktop.matches || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable]')) return;
  const down = e.key === 'ArrowDown' || e.key === 'PageDown';
  const up = e.key === 'ArrowUp' || e.key === 'PageUp';
  if (!down && !up) return;
  e.preventDefault();
  const sc = scrollerOf(active);
  if (canScroll(sc) && !atEdge(sc, up)) {
    const step = e.key.startsWith('Page') ? sc.clientHeight * 0.9 : 80;
    sc.scrollBy({ top: up ? -step : step, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    return;
  }
  setActive(active + (down ? 1 : -1));
});

/* Hamburger overlay (mobile). */
function setMenu(open: boolean) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close section menu' : 'Open section menu');
  if (open) menu.querySelector('a')?.focus();
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
});
desktop.addEventListener('change', () => setMenu(false));

menu.addEventListener('click', (e) => {
  const a = (e.target as Element).closest('a');
  if (!a) return;
  e.preventDefault();
  setMenu(false);
  goTo(Number(a.closest('li')!.dataset.i));
});

/* Mobile: track the section in view for the backdrop, nav and hash. */
addEventListener('scroll', () => {
  if (desktop.matches) return;
  const line = innerHeight * 0.4;
  let cur = 0;
  sections.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) cur = k; });
  setActive(cur);
}, { passive: true });

/* Keep section content clear of the nav rail. */
function fitRail() {
  if (!desktop.matches) return;
  let r = 0;
  menu.querySelectorAll('a').forEach((a) => { r = Math.max(r, a.getBoundingClientRect().left + a.scrollWidth + 8); });
  document.documentElement.style.setProperty('--rail', Math.max(r + 32, 244) + 'px');
}
fitRail();
addEventListener('resize', fitRail);
document.fonts?.ready.then(fitRail);

/* Slide out when heading to the Content Hub. */
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="/content"]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || reduceMotion.matches) return;
  e.preventDefault();
  try { sessionStorage.setItem('ws-slide-in', '1'); } catch {}
  document.body.classList.add('leaving');
  setTimeout(() => (location.href = a.href), 380);
});
addEventListener('pageshow', () => document.body.classList.remove('leaving'));

/* Open from hash. */
const start = sections.findIndex((s) => '#' + s.id === location.hash);
if (start > 0) {
  if (desktop.matches) setActive(start);
  else requestAnimationFrame(() => sections[start].scrollIntoView());
}
addEventListener('hashchange', () => {
  const i = sections.findIndex((s) => '#' + s.id === location.hash);
  if (i >= 0) goTo(i);
});
