import { z, defineCollection } from 'astro:content';

function dedupe(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

export const collections = {
	post: defineCollection({
		type: 'content',
		schema: ({ image }) =>
			z.object({
				title: z.string().max(60),
				description: z.string().min(50).max(160),
				publishDate: z.date(),
				coverImage: z
					.object({
						src: image(),
						alt: z.string(),
					})
					.optional(),
				tags: z.array(z.string()).default([]).transform(dedupe),
				ogImage: z.string().optional(),
				draft: z.boolean().default(true),
			}),
	}),
};
