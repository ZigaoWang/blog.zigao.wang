import type { CollectionEntry } from 'astro:content';

/** URL-safe slug for a tag, e.g. "reinforcement-learning" -> same, "AI" -> "ai". */
export function tagSlug(tag: string): string {
	return tag
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9一-鿿]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export type TagInfo = { name: string; slug: string; count: number };

/**
 * Collect tags across posts. Tags that differ only by case ("AI" / "ai") share
 * a slug, so they're merged and the most common spelling wins.
 */
export function collectTags(posts: CollectionEntry<'blog'>[]): TagInfo[] {
	const bySlug = new Map<string, { counts: Map<string, number>; total: number }>();

	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			const slug = tagSlug(tag);
			if (!slug) continue;
			const entry = bySlug.get(slug) ?? { counts: new Map(), total: 0 };
			entry.counts.set(tag, (entry.counts.get(tag) ?? 0) + 1);
			entry.total++;
			bySlug.set(slug, entry);
		}
	}

	return [...bySlug.entries()]
		.map(([slug, { counts, total }]) => ({
			slug,
			count: total,
			name: [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0],
		}))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function postsWithTag(posts: CollectionEntry<'blog'>[], slug: string) {
	return posts.filter((p) => (p.data.tags ?? []).some((t) => tagSlug(t) === slug));
}
