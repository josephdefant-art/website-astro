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
      image: image(),
      imageAlt: z.string(),
      imageSide: z.enum(['left', 'right']),
      imageWidth: z.string(), // share of the row the photo takes on desktop, e.g. "44%"
      imagePosition: z.string().default('center 30%'), // which part of the photo stays visible when cropped
      justify: z.boolean().default(false),
    }),
});

export const collections = { sections };
