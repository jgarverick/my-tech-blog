import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).default([]),
			// Drafts render in `astro dev` but are left out of production builds.
			draft: z.boolean().default(false),
			// Original Blogspot path, written by scripts/blogger-to-astro.mjs.
			bloggerPath: z.string().optional(),
		}),
});

export const collections = { blog };
