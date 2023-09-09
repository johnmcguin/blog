import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/site-config';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { isPublished } from '../utils/post';
const parser = new MarkdownIt();

export const GET = async () => {
	const posts = await getCollection('post', isPublished);

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			tags: post.data.tags.join(', '),
			link: `blog/${post.slug}`,
			content: sanitizeHtml(parser.render(post.body)),
		})),
	});
};
