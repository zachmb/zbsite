// Builds src/lib/pemptousia.json — a small feed of recent Pemptousia articles
// (title, link, date, category, short excerpt) from the site's RSS feed. Only a
// brief excerpt is stored; each item links back to the full article at the source.
//
// Download: curl -sA Mozilla/5.0 https://pemptousia.com/feed/ -o /tmp/pempt.xml
// Usage: node scripts/build-pemptousia.mjs [path-to-rss-xml]
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = process.argv[2] ?? '/tmp/pempt.xml';
const outPath = resolve(__dirname, '../src/lib/pemptousia.json');

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', '#8217': '’', '#8216': '‘', '#8220': '“', '#8221': '”', '#8230': '…', '#038': '&' };
const decode = (s) =>
	s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, ent) => {
		if (ent[0] === '#') {
			const code = ent[1] === 'x' || ent[1] === 'X' ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
			return Number.isFinite(code) ? String.fromCodePoint(code) : m;
		}
		return ent in NAMED ? NAMED[ent] : m;
	});
const strip = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const field = (block, tag) => {
	const m = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
	return m ? m[1].trim() : '';
};

const xml = await readFile(srcPath, 'utf8');
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

const articles = items.map((it) => {
	const title = strip(field(it, 'title'));
	const link = field(it, 'link').trim();
	const pub = field(it, 'pubDate');
	const date = pub ? new Date(pub).toISOString().slice(0, 10) : '';
	const cats = [...it.matchAll(/<category[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/g)].map((c) => strip(c[1]));
	let excerpt = strip(field(it, 'description'));
	if (excerpt.length > 180) excerpt = excerpt.slice(0, 180).replace(/\s+\S*$/, '') + '…';
	return { title, link, date, category: cats[0] || '', excerpt };
}).filter((a) => a.title && a.link);

const data = {
	source: 'pemptousia.com',
	note: 'Recent articles from Pemptousia; excerpts shown with links to the full articles.',
	articles
};
await writeFile(outPath, JSON.stringify(data, null, '\t') + '\n', 'utf8');
console.log(`Wrote ${outPath} — ${articles.length} articles`);
for (const a of articles.slice(0, 5)) console.log(`  ${a.date}  ${a.title.slice(0, 60)}`);
