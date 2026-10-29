// Parses the George Long translation of Marcus Aurelius' Meditations
// (sourced from The Internet Classics Archive, classics.mit.edu) into
// structured JSON consumed by the /meditations viewer page.
//
// Usage: node scripts/build-meditations.mjs /tmp/meditations.txt
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = process.argv[2] ?? '/tmp/meditations.txt';
const outPath = resolve(__dirname, '../src/lib/meditations.json');

const BOOK_WORDS = [
	'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX',
	'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE'
];

const raw = await readFile(srcPath, 'utf8');
// Normalize line endings.
const text = raw.replace(/\r\n/g, '\n');
const lines = text.split('\n');

// Find each "BOOK <WORD>" marker line index.
const markers = [];
lines.forEach((line, i) => {
	const m = line.trim().match(/^BOOK\s+([A-Z]+)$/);
	if (m && BOOK_WORDS.includes(m[1])) {
		markers.push({ word: m[1], line: i, num: BOOK_WORDS.indexOf(m[1]) + 1 });
	}
});

// Locate the end of the final book (before "THE END").
const endIdx = lines.findIndex((l) => l.trim() === 'THE END');

const books = markers.map((marker, idx) => {
	const start = marker.line + 1;
	const stop = idx + 1 < markers.length ? markers[idx + 1].line : (endIdx === -1 ? lines.length : endIdx);
	const body = lines.slice(start, stop);

	// Split into paragraphs on blank lines; collapse soft-wrapped lines
	// within a paragraph into a single space-joined string.
	const paragraphs = [];
	let current = [];
	const flush = () => {
		if (current.length) {
			const joined = current.join(' ').replace(/\s+/g, ' ').trim();
			// Skip divider lines (rows of dashes/underscores) that separate books.
			const isDivider = joined.length > 0 && /^[-_=\s]+$/.test(joined);
			if (joined && !isDivider) paragraphs.push(joined);
			current = [];
		}
	};
	for (const line of body) {
		if (line.trim() === '') flush();
		else current.push(line.trim());
	}
	flush();

	return {
		number: marker.num,
		title: `Book ${titleCase(marker.word)}`,
		dateline: null,
		sections: paragraphs.map((text, i) => ({ n: i + 1, text }))
	};
});

// The source text places the composition datelines ("Among the Quadi at the
// Granua.", "This in Carnuntum.") at the end of the PRECEDING book. The
// canonical edition shows them as a heading atop their own book — move them.
for (let i = 0; i < books.length - 1; i++) {
	const last = books[i].sections.at(-1);
	// Datelines are terse location notes (<= 40 chars); real sections run long.
	if (last && last.text.length <= 40) {
		books[i].sections.pop();
		books[i + 1].dateline = last.text.replace(/\.$/, '');
		books[i].sections.forEach((s, j) => (s.n = j + 1));
	}
}

function titleCase(word) {
	return word.charAt(0) + word.slice(1).toLowerCase();
}

const totalSections = books.reduce((acc, b) => acc + b.sections.length, 0);

const data = {
	title: 'The Meditations',
	author: 'Marcus Aurelius',
	translator: 'George Long',
	source: 'The Internet Classics Archive — classics.mit.edu/Antoninus/meditations.html',
	books
};

await writeFile(outPath, JSON.stringify(data, null, '\t') + '\n', 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Books: ${books.length}, sections: ${totalSections}`);
books.forEach((b) => console.log(`  ${b.title}: ${b.sections.length} sections`));
