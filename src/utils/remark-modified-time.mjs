import { execSync } from 'node:child_process';
import { siteConfig } from '../site.config';
const dateFormat = new Intl.DateTimeFormat(undefined, siteConfig.date.options);

export function remarkLastModified() {
	return function (_tree, file) {
		const filepath = file.history[0];
		const result = execSync(`git log -1 --pretty="format:%cI" ${filepath}`);
		if (result.length > 0) {
			file.data.astro.frontmatter.lastModified = dateFormat.format(new Date(result.toString()));
		}
	};
}
