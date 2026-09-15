# Local college logo fallbacks

This directory holds locally-shipped college SVG logos as the **second tier**
of the `<CollegeLogo>` fallback chain (Clearbit → local SVG → monogram badge).

## When to add a logo here

- Clearbit returns 404 for the school's domain (rare for top-50, common for
  smaller LACs and overseas universities).
- The school's brand guidelines require a specific official mark that
  Clearbit's autosynthesized version doesn't match.
- You want to guarantee zero CDN dependency for a particular school
  (e.g., for offline demos, or in case Clearbit changes their free tier).

## File naming

`<slug>.svg` where `<slug>` is the slug used in `data/colleges.ts`. For
example:

```
harvard-university.svg
yale-university.svg
massachusetts-institute-of-technology.svg
stanford-university.svg
university-of-california-berkeley.svg
```

## Sizing

SVG files should:
- Use a viewBox sized 0–256 or 0–512 (uniform).
- Center the mark with even padding; the consumer wraps in a square box.
- Render at 16px and 64px without losing legibility (test both extremes).
- Avoid embedded raster (`<image>`) — vector paths only, so they look
  crisp at any resolution.

## License & attribution

Every logo committed here MUST have a redistribution license that permits
commercial use OR be sourced from the school's official press/brand-asset
page with the school's permission documented in `LICENSES.md` (next to
this file). When in doubt, fall through to the monogram tier — it always
renders, never infringes.

## How the fallback chain works

```
1. <CollegeLogo domain="harvard.edu" slug="harvard-university" name="Harvard University" />
   ↓ tries Clearbit URL
2. ↓ Clearbit returns 404 → switches to /colleges/harvard-university.svg
3. ↓ Local SVG missing → switches to monogram badge ("HU" in primary blue)
```

`CollegeLogo` lives at `components/college-logo.tsx`. It accepts:

- `name` (required) — full school name, used for the monogram fallback
- `domain` (optional) — feeds tier 1 (Clearbit)
- `slug` (optional) — feeds tier 2 (local SVG)
- `size` — pixel dimension (default 40)
- `rounded` — circular vs rounded-square (default true)
