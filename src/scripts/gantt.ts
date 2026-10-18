// Career Gantt (D3). Loaded lazily the first time Connect is shown.
import { select, scaleTime, axisBottom, timeYear, timeFormat, max } from 'd3';
import { computeRows, firstOfMonth, fmtMonth, summary, ym, yearsLabel, START, type ComputedRow } from '../data/career';

const COLOR = { work: '#5CC2F2', edu: '#A9B6E6' };
const NOW = firstOfMonth();
const rows = computeRows(NOW);

// Live copy (the server-rendered text is correct as of the last build).
const s = summary(NOW);
document.getElementById('tl-range')!.textContent = s.range;
document.getElementById('tl-years')!.textContent = s.years;
document.getElementById('tl-sectors')!.textContent = s.sectors;

const host = document.getElementById('gantt')!;

/* Phones: a vertical timeline (newest first) instead of the horizontal Gantt.
   Each entry shows dates, title, org and a duration bar scaled to the longest role. */
function drawList() {
  const longest = Math.max(...rows.map((r) => r.yrs));
  const ol = document.createElement('ol');
  ol.className = 'g-list';
  rows.forEach((r, i) => {
    const start = new Date(Math.min(...r.segs.map((g) => +g.s)));
    const open = r.spans.some(([, e]) => e === null);
    const continues = !!r.group && rows[i - 1]?.group === r.group; // same org as the entry above
    const li = document.createElement('li');
    li.className = `g-item g-${r.type}${continues ? ' g-cont' : ''}`;
    const add = (tag: string, cls: string, text: string) => {
      const el = document.createElement(tag);
      el.className = cls;
      el.textContent = text;
      return li.appendChild(el);
    };
    if (r.group && !continues) add('p', 'g-org g-org-group', r.org);
    add('p', 'g-when', `${fmtMonth(start)} – ${open ? 'Present' : fmtMonth(r.end)}`);
    add('p', 'g-title', r.title);
    if (r.org && !r.group) add('p', 'g-org', r.org);
    const dur = add('p', 'g-dur', '');
    const bar = document.createElement('span');
    bar.className = 'g-dbar';
    bar.style.width = `${Math.max(3, (r.yrs / longest) * 70)}%`; // longest role = 70%, leaving room for the label
    const yrs = document.createElement('span');
    yrs.textContent = yearsLabel(r.yrs);
    dur.append(bar, yrs);
    ol.append(li);
  });
  const key = document.createElement('p');
  key.className = 'g-key';
  key.innerHTML = '<span class="g-work">Work experience</span><span class="g-edu">Education</span>';
  host.append(ol, key);
}

function draw() {
  select(host).select('svg').remove();
  host.querySelectorAll('.g-list, .g-key').forEach((e) => e.remove());
  const W = host.clientWidth;
  if (!W) return;
  if (W < 640) return drawList();
  const small = false, rowH = 34, bh = 9, gap = 10; // compact SVG layout is replaced by drawList()

  // Measure label text with the real SVG styles.
  const probe = select(host).append('svg').attr('class', 'g-probe');
  const textW = (t: string, cls = 'g-label') => {
    const n = probe.append('text').attr('class', cls).text(t);
    const w = n.node()!.getComputedTextLength();
    n.remove();
    return w;
  };
  const orgW = textW('The Information Lab', 'g-label g-til');
  const lw = small ? 0 : Math.ceil(max(rows, (r) => (r.group ? textW(r.title + ',') + gap + orgW : textW(r.label)))!) + 8;
  probe.remove();

  const m = { t: 8, r: 70, b: small ? 64 : 30, l: lw ? lw + 16 : 0 }; // compact: legend sits under the axis
  const hOf = (r: ComputedRow) => (!small && r.group ? rowH / 2 : rowH); // merged-cell rows are half height
  const pos = new Map<ComputedRow, [number, number]>();
  let acc = m.t;
  rows.forEach((r) => { pos.set(r, [acc, hOf(r)]); acc += hOf(r); });
  const H = acc + m.b;
  const y = (r: ComputedRow) => pos.get(r)![0];
  const yh = (r: ComputedRow) => pos.get(r)![1];
  const by = (r: ComputedRow) => y(r) + (small ? yh(r) - bh - 6 : (yh(r) - bh) / 2);

  const x = scaleTime().domain([ym(START), NOW]).range([m.l, W - m.r]);
  const svg = select(host).append('svg')
    .attr('width', W).attr('height', H)
    .attr('role', 'group').attr('aria-label', `Career timeline, ${fmtMonth(ym(START))} to ${fmtMonth(NOW)}`);

  const ticks = x.ticks(timeYear.every(5)!);
  svg.append('g').attr('class', 'g-grid').attr('aria-hidden', 'true').selectAll('line').data(ticks).join('line')
    .attr('x1', x).attr('x2', x).attr('y1', m.t).attr('y2', H - m.b);
  svg.append('g').attr('class', 'g-axis').attr('aria-hidden', 'true').attr('transform', `translate(0,${H - m.b + 8})`)
    .call(axisBottom(x).tickValues(ticks).tickFormat((d) => timeFormat('%Y')(d as Date)).tickSize(0))
    .select('.domain').remove();

  const bars = svg.append('g').selectAll<SVGGElement, ComputedRow>('g').data(rows).join('g')
    .attr('class', 'g-bar').attr('tabindex', 0).attr('role', 'img')
    .attr('aria-label', (r) => `${r.label}, ${yearsLabel(r.yrs)}`);
  bars.append('rect').attr('class', 'g-hit').attr('x', 0).attr('width', W).attr('y', y).attr('height', yh);

  if (small) {
    bars.append('text').attr('class', 'g-label').attr('x', 0).attr('y', (r) => y(r) + 14).text((r) => r.label);
  } else {
    const lx = lw - 4;
    bars.append('text').attr('class', 'g-label').attr('text-anchor', 'end')
      .attr('x', (r) => (r.group ? lx - orgW - gap : lx))
      .attr('y', (r) => y(r) + yh(r) / 2).attr('dy', '0.35em')
      .text((r) => (r.group ? r.title + ',' : r.label));
    // One merged org label per group, centred across its rows.
    const groups = [...new Set(rows.filter((r) => r.group).map((r) => r.group))];
    svg.append('g').attr('class', 'g-orgs').attr('aria-hidden', 'true').selectAll('text').data(groups).join('text')
      .attr('class', 'g-label g-til').attr('text-anchor', 'end').attr('x', lx).attr('dy', '0.35em')
      .attr('y', (g) => {
        const rs = rows.filter((r) => r.group === g);
        return (y(rs[0]) + y(rs.at(-1)!) + yh(rs.at(-1)!)) / 2;
      })
      .text((g) => rows.find((r) => r.group === g)!.org);
  }

  bars.selectAll('rect.seg').data((r) => r.segs.map((g) => ({ ...g, r }))).join('rect')
    .attr('class', 'seg')
    .attr('x', (g) => x(g.s)).attr('y', (g) => by(g.r))
    .attr('width', (g) => Math.max(3, x(g.e) - x(g.s))).attr('height', bh)
    .attr('fill', (g) => COLOR[g.r.type])
    .style('transition-delay', (g) => `${0.1 + rows.indexOf(g.r) * 0.08}s`);
  bars.append('text').attr('class', 'g-yrs')
    .attr('x', (r) => x(r.end) + 6).attr('y', (r) => by(r) + bh / 2).attr('dy', '0.35em')
    .text((r) => yearsLabel(r.yrs));

  const legend = svg.append('g').attr('class', 'g-legend').attr('transform', `translate(${W - 118},${small ? H - 27 : H - m.b - 26})`);
  ([['Work experience', 'work'], ['Education', 'edu']] as const).forEach(([label, type], i) => {
    const g = legend.append('g').attr('transform', `translate(0,${i * 18})`);
    g.append('rect').attr('width', 12).attr('height', 9).attr('y', -5).attr('fill', COLOR[type]);
    g.append('text').attr('x', 18).attr('dy', '0.32em').text(label);
  });

  // Hover/focus: keep the row, fade the rest. No tooltip.
  bars
    .on('mouseenter focus', (_, r) => {
      svg.classed('focus', true).classed('til-hi', !!r.group);
      bars.classed('hi', (b) => b === r);
    })
    .on('mouseleave blur', () => {
      svg.classed('focus', false).classed('til-hi', false);
      bars.classed('hi', false);
    });

  // Next frame: let the bars grow in.
  requestAnimationFrame(() => requestAnimationFrame(() => svg.classed('ready', true)));
}

document.fonts.ready.then(draw);
let lastW = host.clientWidth, t: ReturnType<typeof setTimeout>;
new ResizeObserver(() => {
  if (host.clientWidth === lastW) return; // redraw on width change only
  lastW = host.clientWidth;
  clearTimeout(t);
  t = setTimeout(draw, 120);
}).observe(host);
