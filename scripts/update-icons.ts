import * as cheerio from 'cheerio';
import { writeFile } from 'node:fs/promises';
import { join, resolve, normalize } from 'node:path';

(async () => {
	console.clear();

	const response = await fetch('https://fontawesome.com/icons').then((res) => res.text());
	const $ = cheerio.load(response);

	const headComponentFile = resolve(
		normalize(
			join(
				import.meta.dirname.replace('file://', ''),
				'..',
				'src',
				'lib',
				'components',
				'fontawesome',
				'Head.svelte'
			)
		)
	);

	const stylesheets = $(
		'head > link[rel="stylesheet"][href^="https://site-assets.fontawesome.com/releases"]'
	)
		.map((_, el) => {
			const href = $(el).attr('href');
			return `\t<link rel="stylesheet" href="${href}">`;
		})
		.toArray();

	const stringToWrite = `<svelte:head>\n${stylesheets.join('\n')}\n</svelte:head>`;
	await writeFile(headComponentFile, stringToWrite, 'utf-8');
})();
