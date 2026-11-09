import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each text section of the page is one Markdown file in src/content/sections.
// Edit the text there; layout and colours are set in the frontmatter.
const sections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sections' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      background: z.string(),
      // optional: without a photo the side shows an empty coloured block (desktop) / nothing (phones)
      image: image().optional(),
      imageAlt: z.string().default(''),
      imageSide: z.enum(['left', 'right']),
      imageWidth: z.string(), // share of the row the photo takes on desktop, e.g. "44%"
      imagePosition: z.string().default('center 30%'), // which part of the photo stays visible when cropped
      justify: z.boolean().default(false),
      hidden: z.boolean().default(false), // true = section is left out of the built page
    }),
});

// Each project in the PROJEKTE section is one Markdown file in src/content/projects.
// The file name prefix ("1-", "2-", ...) is only for sorting in the folder; `order` sets the order on the page.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      image: image().optional(),
      imageAlt: z.string().default(''),
      hidden: z.boolean().default(false), // true = project is left out of the built page
    }),
});

export const collections = { sections, projects };
