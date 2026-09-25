import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    slug: z.string(),
    rubric: z.string(),
    category: z.string(),
    title: z.string(),
    hook: z.string().optional(),
    summary: z.string(),
    icon: z.string(),
    map: z.string().optional(),
    date: z.string(),
    checkedDate: z.string(),
    images: z.array(z.string()).optional(),
    embed: z.string().optional(),
    toc: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
    group: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { articles };
