# josephdefant.de (Astro)

One-page site for Joseph Defant, rebuilt from the WordPress/Kadence version.

## Run locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/ locally
```

## Photos

`src/assets/images/` holds the full-size originals (taken from the WordPress
uploads; Biografie and Unterricht use the versions cropped in WordPress).
To change a photo, overwrite the file with the same name. Astro creates
resized WebP versions automatically at build time.

## Where to edit things

| What                         | File                                   |
|------------------------------|----------------------------------------|
| Biografie / Unterricht text  | `src/content/sections/*.md`            |
| Section colour, photo, crop  | frontmatter at the top of those `.md` files |
| Phone, e-mail, Instagram     | `src/data/contact.json`                |
| Name / subtitle (hero)       | `src/components/Hero.astro`            |
| Page title, description      | `src/pages/index.astro`                |
| Shared layout & styles       | `src/styles/global.css`                |

In the Markdown files, a line ending in `\` is a line break inside a paragraph;
an empty line starts a new paragraph.

A new text section = a new `.md` file in `src/content/sections/` with the same
frontmatter fields (`order` decides its position).

## Deploy (Cloudflare Pages)

Connect the Git repo to a Cloudflare Pages project:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`

Check the `*.pages.dev` preview, then move the custom domain `josephdefant.de`
to the new project. The page URL stays `/`, so no redirects are needed.

## Open points

- **Impressum / Datenschutz**: the current site has neither. A professional site in
  Germany needs an Impressum; add them as `src/pages/impressum.astro` and
  `src/pages/datenschutz.astro` and link them from a small footer.
- Image alt texts are short guesses; adjust them in the `.md` frontmatter and components.

## Editing in the browser (Pages CMS)

`.pages.yml` configures [Pages CMS](https://app.pagescms.org): sign in with GitHub,
open this repo, and edit "Abschnitte" (section texts, photos, colours) and
"Kontakt". Each save is a Git commit; Cloudflare rebuilds the site automatically.
The hero (name, subtitle, hero photo) and the Kontakt photo are edited in code.
