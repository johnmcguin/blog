/** @type {import("@types/prettier").Options} */
module.exports = {
	printWidth: 100,
	proseWrap: 'always',
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	useTabs: true,
	plugins: [
		import('prettier-plugin-astro'),
		import('prettier-plugin-tailwindcss') /* Must come last */,
	],
	pluginSearchDirs: false,
	overrides: [
		{
			files: '**/*astro',
			options: {
				parser: 'astro',
			},
		},
	],
};
