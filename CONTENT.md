# Editing content

All home-page showcases and the Content Hub are driven by one file:
[`src/content/items.json`](src/content/items.json). The home page shows the first 5 items of
each category in file order (the first one is the main item); the hub shows everything.

Run `npm run dev` to preview at http://localhost:4321. Pushing to `master` builds and deploys.

## Add an item

Add an object to `src/content/items.json` where you want it to appear:

```json
{
  "cat": "dataviz",
  "title": "My new viz",
  "tag": "Viz · Tableau Public",
  "desc": "One or two sentences. The home page shows up to three lines.",
  "href": "https://public.tableau.com/app/profile/wjsutton/viz/...",
  "link": "Open viz",
  "img": "https://public.tableau.com/thumb/views/MyNewViz/Dashboard1"
}
```

Then run:

```bash
npm run fetch-images
```

It downloads any `http…` `img` or `portrait` into `src/assets/items/` and rewrites the path to
the local file. You can also drop a file into `src/assets/items/` yourself and set
`"img": "../assets/items/my-file.png"`. Images are converted to WebP, resized and lazy-loaded
at build time.

| Field | Required | Notes |
|---|---|---|
| `cat` | yes | A category id from `src/data/categories.ts`. The build fails on an unknown id. |
| `title`, `tag`, `desc` | yes | Search matches all three. |
| `href` | yes | A URL, a `/path`, or `"#"` for "no link yet" (renders without a link). |
| `link` | yes | CTA label, e.g. "Open viz", "View repo", "Watch". |
| `img` | no | Landscape 16:9. Without it, a text placeholder shows the tag and title. |
| `portrait` | no | 4:5 image used when the main item flips to portrait (narrow or short windows). |
| `badge` | no | Small label on the image, e.g. "Iron Viz 2022 · Champion". |
| `focus` | no | CSS `object-position` for cropping, e.g. `"30% 20%"`. |

## Add a portrait image

Put the 4:5 image (around 1200×1500) in `src/assets/items/` and add it to the item:

```json
"portrait": "../assets/items/dataviz-closing-the-youth-literacy-gap-portrait.jpg"
```

The main item uses it automatically whenever it switches to portrait. Without it, the landscape
image is cropped to 4:5 (use `focus` to steer the crop).

## Add a category

1. Add a line to `CATEGORIES` in [`src/data/categories.ts`](src/data/categories.ts) with an `id`,
   a `label` and one of the imported `backdrop` photos (or import a new one).
2. Use the new `id` as `cat` on items in `items.json`.

That's all: the nav rail, the home section (with its `#id` hash), the hub chip and its
`/content?cat=id` link are generated from that list.

## Open TODOs

Search the code for `TODO(` to find them.

- **Portrait (4:5) images**: none yet, so landscape images are cropped (`portrait` field).
- **Talk link**: "Iron Viz" (Enablement) has `"href": "#"`, so it renders without a link.
- **Parked talks**: two talks were taken off the site until their content is ready (below).
- **Welcome video**: done. To re-cut it, see [`sizzle_reel/README.md`](sizzle_reel/README.md).

## Parked items

Removed from `items.json` until there is content (a link and an image) to support them.
Add each back to `src/content/items.json` with a real `href` and an `img`.

```json
{ "cat": "enablement", "title": "Agentic analytics", "tag": "Talk", "desc": "Practical patterns for AI agents working with Tableau, dbt, and the wider stack.", "href": "#", "link": "Find out more" },
{ "cat": "engineering", "title": "Data engineering for analysts", "tag": "Talk", "desc": "Bridging the skills gap with dbt and SQL — the path from analyst to engineer.", "href": "#", "link": "Find out more" }
```
