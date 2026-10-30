// Builds src/lib/meditations.json — the George Long translation of Marcus
// Aurelius' Meditations with the correct, canonical section numbering.
//
// Source: the Standard Ebooks edition of the George Long translation
// (https://standardebooks.org/ebooks/marcus-aurelius/meditations/george-long),
// vendored alongside this script as standardebooks-meditations.html. Standard
// Ebooks preserves George Long's own sectioning — each numbered entry is one
// paragraph — which the raw classics.mit.edu text did not (it put single
// sentences on their own lines, over-splitting sections). Each <p> inside a
// book becomes one numbered section; the two "where-written" datelines
// ("Among the Quadi at the Granua", "This in Carnuntum") head Books 2 and 3.
//
// Usage: node scripts/build-meditations.mjs [path-to-standardebooks-html]
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = process.argv[2] ?? resolve(__dirname, 'standardebooks-meditations.html');
const outPath = resolve(__dirname, '../src/lib/meditations.json');

const ORDINAL = [
	'One', 'Two', 'Three', 'Four', 'Five', 'Six',
	'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'
];

const NAMED = {
	amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
	mdash: '—', ndash: '–', hellip: '…',
	lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”'
};

function decode(s) {
	return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, ent) => {
		if (ent[0] === '#') {
			const code = ent[1] === 'x' || ent[1] === 'X'
				? parseInt(ent.slice(2), 16)
				: parseInt(ent.slice(1), 10);
			return Number.isFinite(code) ? String.fromCodePoint(code) : m;
		}
		return ent in NAMED ? NAMED[ent] : m;
	});
}

const html = await readFile(srcPath, 'utf8');

function bookParagraphs(n) {
	const start = html.indexOf(`id="book-${n}"`);
	const stop = n < 12 ? html.indexOf(`id="book-${n + 1}"`) : html.indexOf('id="endnotes"');
	const chunk = html.slice(start, stop);
	const paras = [...chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => {
		let p = m[1];
		p = p.replace(/<a\b[^>]*epub:type="noteref"[^>]*>.*?<\/a>/g, ''); // drop endnote refs
		p = p.replace(/<[^>]+>/g, ' '); // strip remaining tags
		p = decode(p).replace(/\s+/g, ' ').trim();
		return p;
	});
	return paras.filter(Boolean);
}

const books = ORDINAL.map((word, idx) => ({
	number: idx + 1,
	title: `Book ${word}`,
	dateline: null,
	sections: bookParagraphs(idx + 1)
}));

// The two composition datelines sit as the final paragraph of Books 1 and 2
// in the source; George Long places them as headings of Books 2 and 3.
const stripDot = (s) => s.replace(/\.$/, '');
for (let i = 0; i < books.length - 1; i++) {
	const last = books[i].sections.at(-1);
	if (last && last.length <= 40) {
		books[i].sections.pop();
		books[i + 1].dateline = stripDot(last);
	}
}

// Number sections 1..N within each book.
for (const b of books) {
	b.sections = b.sections.map((text, i) => ({ n: i + 1, text }));
}

const data = {
	title: 'The Meditations',
	author: 'Marcus Aurelius',
	translator: 'George Long',
	source: 'Standard Ebooks — George Long translation (standardebooks.org/ebooks/marcus-aurelius/meditations/george-long)',
	books
};

await writeFile(outPath, JSON.stringify(data, null, '\t') + '\n', 'utf8');

const total = books.reduce((a, b) => a + b.sections.length, 0);
console.log(`Wrote ${outPath}`);
console.log(`Books: ${books.length}, sections: ${total}`);
for (const b of books) {
	console.log(`  ${b.title}: ${b.sections.length}${b.dateline ? ` (dateline: ${b.dateline})` : ''}`);
}
