// Showcase: size the main item (16:9, or 4:5 when narrow), swap it when an
// unselected thumbnail is chosen, open the link when the selected one is.
import { desktop, reduceMotion } from './media';

for (const show of document.querySelectorAll<HTMLElement>('[data-show]')) {
  const stage = show.querySelector<HTMLElement>('.stage')!;
  const panels = [...stage.querySelectorAll<HTMLElement>('.panel')];
  const tiles = [...show.querySelectorAll<HTMLAnchorElement>('.tile')];
  let selected = 0;

  function size() {
    for (const p of ['--fw', '--fh', '--tw']) stage.style.removeProperty(p);
    if (!desktop.matches) return;
    const maxH = stage.clientHeight - 200, avail = stage.clientWidth;
    if (maxH <= 0 || !avail) return;
    let w = Math.min(avail, (maxH * 16) / 9), h = (w * 9) / 16;
    const portrait = h < maxH * 0.62;
    if (portrait) { h = Math.min(maxH, (avail * 5) / 4); w = h * 0.8; }
    stage.classList.toggle('portrait', portrait);
    stage.style.setProperty('--fw', w + 'px');
    stage.style.setProperty('--fh', h + 'px');
    stage.style.setProperty('--tw', Math.max(w, 280) + 'px');
  }
  let t: ReturnType<typeof setTimeout>;
  new ResizeObserver(() => { clearTimeout(t); t = setTimeout(size, 30); }).observe(stage);
  size();

  function select(k: number) {
    if (k === selected) return;
    const from = tiles[k].getBoundingClientRect();
    panels[selected].hidden = true;
    panels[k].hidden = false;
    tiles[selected].removeAttribute('aria-current');
    tiles[k].setAttribute('aria-current', 'true');
    selected = k;
    if (reduceMotion.matches) return;

    // Grow the new main item out of the thumbnail it came from (FLIP).
    const feat = panels[k].querySelector<HTMLElement>('.feat')!;
    const text = panels[k].querySelector<HTMLElement>('.stage-text')!;
    const to = feat.getBoundingClientRect();
    feat.animate(
      [
        { transformOrigin: '0 0', opacity: 0.4, transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
        { transformOrigin: '0 0', opacity: 1, transform: 'none' },
      ],
      { duration: 500, easing: 'cubic-bezier(.2,.7,.2,1)' },
    );
    text.animate([{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }], { duration: 330 });
  }

  tiles.forEach((tile, k) => {
    tile.addEventListener('click', (e) => {
      if (k !== selected) { e.preventDefault(); select(k); }
      // Selected tile: the link's own default opens the item.
    });
    tile.addEventListener('keydown', (e) => {
      if (e.key === ' ' || (e.key === 'Enter' && !tile.hasAttribute('href'))) { e.preventDefault(); tile.click(); }
    });
  });

  // Clicking the text block opens the item, like its CTA.
  stage.addEventListener('click', (e) => {
    const target = e.target as Element;
    if (target.closest('a')) return;
    if (target.closest('.stage-text')) panels[selected].querySelector<HTMLAnchorElement>('.cta')?.click();
  });
}

// Mobile cards: the whole card opens the item.
for (const card of document.querySelectorAll<HTMLElement>('.f-card')) {
  card.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('a')) card.querySelector<HTMLAnchorElement>('.cta')?.click();
  });
}
