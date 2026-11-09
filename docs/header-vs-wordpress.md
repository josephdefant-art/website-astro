# Header vs. the WordPress site (josephdefant.de)

Notes from comparing the Astro header with the live WordPress site on 2026-11-09.
Nothing below is applied right now. These are the findings, with the fix for each one if you want it later.

## 1. "More kerning" on the live site is a font loading bug, not spacing (no change)

**What you see:** on `https://www.josephdefant.de` the name JOSEPH DEFANT and headings
like BIOGRAFIE look wider and rounder, as if they had more letter spacing.

**Cause:** that page is not showing Inter. It shows **Arial**.

- WordPress loads the font from `https://josephdefant.de/wp-content/fonts/inter/...` (no `www`).
- When the page is opened as `www.josephdefant.de`, that font comes from a different
  origin, and the server sends no `Access-Control-Allow-Origin` header.
  Browsers block cross-origin fonts without it, so all three Inter weights fail and the text
  falls back to Arial. This happens in every browser (seen in Firefox and Chrome).
- On `https://josephdefant.de` (no `www`) Inter loads, and the header renders identically to the
  Astro site.
- "violoncello" looks nearly the same either way because Arial and Inter come out at
  about the same width at that size and weight. Only the heavy text visibly changes.

**Checked:**

- Both sites use the exact same font file: Inter `Version 4.001;git-66647c0bb`, `wght` axis 100–900 only.
- The text widths of JOSEPH, DEFANT, violoncello, the headings and the body text are identical to 0.1px when Inter loads on both.
- How the font is declared doesn't matter: the WordPress style (`font-weight: 400 / 700 / 900` faces) and the Fontsource style (`100 900`) render the same in Firefox.

**Decision:** keep Inter (the intended design).

**To fix on the WordPress side:** serve the site under a single host (redirect `www.` to the bare
domain or the other way round), or add `Access-Control-Allow-Origin` for font files.

**If you ever want the Arial look instead:** set the heading font to Arial for the name and `h2`.
Not recommended.

## 2. Gap above "violoncello" is 12.6px smaller locally (reverted)

Live: `margin-top: calc(min(105px, 10.5vw) * 0.12)` on `.hero-subtitle` (12.6px at full size),
and `margin-bottom: 1em`. That makes the header 443.9px tall at 1024px wide.

Locally that margin-top is overwritten by the global rule `.row .text p { margin: 0 0 1em }`,
which is more specific than the scoped `.hero-subtitle` rule. So the subtitle sits 12.6px
higher and the header is 431.3px tall.

**Fix** in `src/components/Hero.astro`: give the subtitle rule a more specific selector, in both places:

```css
.hero .text .hero-subtitle {
  --name-size: min(105px, 10.5vw);
  margin: calc(var(--name-size) * 0.12) 0 1em;
  /* ...rest unchanged */
}

@media (max-width: 600px) {
  .hero-name,
  .hero .text .hero-subtitle {
    --name-size: min(105px, 19vw);
  }
}
```

The mobile selector has to change too, or the desktop `--name-size` wins on phones.
With this fix the header matched the live site exactly at 1024px and 375px wide.

## 3. Sections are 100vw wide on the live site (reverted)

WordPress "alignfull" blocks are `width: 100vw` (Kadence `--global-vw`), centred with
`margin-left/right: calc(50% - 50vw)`. The overflow is clipped on `.wp-site-blocks` (`overflow-x: clip`).

With a classic desktop scrollbar (about 15px on Windows), each section is therefore wider than the
page and shifted about 7.7px left, and part of it sits under the scrollbar. The effects:

- The name starts about 7px further left on live.
- The text columns are a bit wider (Biografie: 481.7px live vs 474.5px local at 1024px), so the
  justified paragraphs break into different lines and stretch their word spacing differently.

On phones and on macOS (overlay scrollbars) there's no difference.

**Fix** in `src/styles/global.css`, if you want to match it:

```css
main {
  overflow-x: clip;
}

.row {
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  /* ...existing grid rules */
}
```

This is arguably a WordPress quirk (content under the scrollbar), so not copying it is a valid choice.
With the fix, every section's position and size, and the Biografie line breaks, matched live exactly.
