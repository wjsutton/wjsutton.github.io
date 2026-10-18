// Career timeline data, most recent first. `null` end = ongoing (runs to the current month).
// Everything derived from "now" is computed, so the page updates itself each month.

export interface Row {
  title: string;
  org: string;
  group?: 'til'; // rows sharing a group get one merged org label
  type: 'work' | 'edu';
  sector?: string;
  spans: [string, string | null][];
  years?: number; // fixed total, overrides the computed one
}

export const ROWS: Row[] = [
  { title: 'Senior AI Engineering Consultant', org: 'The Information Lab', group: 'til', type: 'work', sector: 'Consulting', spans: [['2025-09', null]] },
  { title: 'Tableau / Alteryx Consultant', org: 'The Information Lab', group: 'til', type: 'work', sector: 'Consulting', spans: [['2022-07', '2025-09']] },
  { title: 'Senior Data Analyst', org: 'WorldRemit', type: 'work', sector: 'Finance', spans: [['2021-10', '2022-07']] },
  { title: 'Senior Data Analyst', org: 'BBC', type: 'work', sector: 'Media & Broadcast', spans: [['2017-04', '2021-10']] },
  { title: 'Senior Analyst', org: 'Cerulli Associates', type: 'work', sector: 'Finance', spans: [['2013-10', '2017-04']] },
  { title: 'Dealing & Portfolio Admin', org: 'Killik Asset Management', type: 'work', sector: 'Finance', spans: [['2011-10', '2013-10']] },
  { title: 'Placements, Internships & Temporary Work', org: '', type: 'work', spans: [['2008-07', '2008-09'], ['2009-09', '2010-07'], ['2011-04', '2011-06'], ['2011-08', '2011-10']], years: 1.25 },
  { title: 'Maths & Management', org: 'Loughborough University', type: 'edu', spans: [['2007-09', '2009-07'], ['2010-09', '2011-07']], years: 3 },
];

export const START = '2007-09';
const DATA_START = '2013-10'; // "N years in data & analytics" counts from here
const SECTOR_FIXED = { Finance: 7, 'Media & Broadcast': 4.5 };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const ym = (s: string) => new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, 1);
export const firstOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1);
export const fmtMonth = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const months = (a: Date, b: Date) => (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
const quarter = (y: number) => Math.round(y * 4) / 4;
export const yearsLabel = (y: number) => `${y} ${y === 1 ? 'year' : 'years'}`;

export function computeRows(now: Date) {
  return ROWS.map((r) => {
    const segs = r.spans.map(([s, e]) => ({ s: ym(s), e: e ? ym(e) : now }));
    const yrs = r.years ?? quarter(segs.reduce((n, g) => n + months(g.s, g.e), 0) / 12);
    const end = new Date(Math.max(...segs.map((g) => +g.e)));
    return { ...r, label: r.org ? `${r.title}, ${r.org}` : r.title, segs, yrs, end };
  });
}
export type ComputedRow = ReturnType<typeof computeRows>[number];

export function summary(now: Date) {
  const consulting = quarter(computeRows(now).filter((r) => r.sector === 'Consulting').reduce((n, r) => n + r.yrs, 0));
  return {
    range: `${fmtMonth(ym(START))} – ${fmtMonth(now)}`,
    years: `${Math.floor(months(ym(DATA_START), now) / 12)} years in data & analytics`,
    sectors: `Sectors: ${SECTOR_FIXED.Finance} years in Finance, ${SECTOR_FIXED['Media & Broadcast']} years in Media & Broadcast, ${consulting} years in Consulting.`,
  };
}
