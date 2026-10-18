// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeRows, summary } from '../src/data/career.ts';

test('career totals and live copy at Oct 2026', () => {
  const now = new Date(2026, 9, 1);
  const rows = computeRows(now);
  assert.equal(rows[0].yrs, 1); // Sep 2025 → Oct 2026 = 13 months, quarter-rounded
  assert.equal(rows[1].yrs, 3.25); // Jul 2022 → Sep 2025
  assert.equal(rows[3].yrs, 4.5); // BBC
  assert.equal(rows[6].yrs, 1.25); // fixed
  assert.equal(+rows[0].end, +now); // ongoing bar runs to now
  assert.deepEqual(summary(now), {
    range: 'Sep 2007 – Oct 2026',
    years: '13 years in data & analytics',
    sectors: 'Sectors: 7 years in Finance, 4.5 years in Media & Broadcast, 4.25 years in Consulting.',
  });
});
