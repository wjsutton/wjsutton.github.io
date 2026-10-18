import keynote from '../assets/backdrops/backdrop-keynote.jpg';
import jm2 from '../assets/backdrops/bg-jm2-tight.jpg';
import el2 from '../assets/backdrops/bg-el2.jpg';

// Order here is the order of the nav, the home sections and the hub chips.
// Adding a category: add a line here, then use its id as `cat` in items.json.
export const CATEGORIES = [
  { id: 'ai', label: 'AI for Analytics', backdrop: jm2 },
  { id: 'dataviz', label: 'Data Visualisation', backdrop: el2 },
  { id: 'engineering', label: 'Data Engineering', backdrop: jm2 },
  { id: 'enablement', label: 'Enablement', backdrop: el2 },
  { id: 'blog', label: 'Blog', backdrop: jm2 },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

// Every full-screen section on the home page, in order.
export const SECTIONS = [
  { id: 'welcome', label: 'Welcome', backdrop: keynote },
  ...CATEGORIES,
  { id: 'connect', label: 'Connect', backdrop: keynote },
];
