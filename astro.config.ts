import { defineConfig, sharpImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import prefetch from '@astrojs/prefetch';
import remarkUnwrapImages from 'remark-unwrap-images';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import { remarkLastModified } from './src/utils/remark-modified-time.mjs';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.waysoftware.dev',
	markdown: {
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime, remarkLastModified],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [''],
			},
		},
		shikiConfig: {
			theme: 'dracula',
			wrap: true,
		},
	},
	image: {
		service: sharpImageService(),
	},
	integrations: [
		mdx({}),
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		prefetch(),
		partytown(),
	],
	compressHTML: true,
	vite: {
		optimizeDeps: {
			exclude: ['@resvg/resvg-js'],
		},
	},
});
