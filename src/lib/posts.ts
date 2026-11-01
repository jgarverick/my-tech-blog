import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All posts, newest first. Drafts are included only in `astro dev`. */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** URL-safe version of a tag, used for /tags/<slug>/ pages. */
export function tagSlug(tag: string): string {
	return tag
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Map of tag slug to its display name and posts, sorted by tag name. */
export async function getTags(): Promise<Map<string, { name: string; posts: Post[] }>> {
	const tags = new Map<string, { name: string; posts: Post[] }>();
	for (const post of await getPosts()) {
		for (const name of post.data.tags) {
			const slug = tagSlug(name);
			if (!slug) continue;
			if (!tags.has(slug)) tags.set(slug, { name, posts: [] });
			tags.get(slug)!.posts.push(post);
		}
	}
	return new Map([...tags].sort((a, b) => a[1].name.localeCompare(b[1].name)));
}
