import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			category: z.string().optional(),
			tags: z.array(z.string()).optional(),
			rating: z.number().min(1).max(5).optional(),
			author: z.string().optional(),
			// BCP 47 language tag for the post body, used for <html lang> and
			// og:locale. Chinese posts were previously served as lang="en".
			lang: z.string().default('en'),
		}),
});

export const collections = { blog };
